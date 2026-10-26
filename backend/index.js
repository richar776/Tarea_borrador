const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const passwordOk = (password) => typeof password === 'string' && password.length >= 8 && /\d/.test(password);

const normalizeRol = (raw) => {
  const t = String(raw || '').trim().toLowerCase();
  if (['inspector', 'inspect'].includes(t)) return 'INSPECTOR';
  if (['admin', 'administrador', 'administrador municipal'].includes(t)) return 'ADMIN';
  const u = String(raw || '').trim().toUpperCase();
  if (u === 'INSPECTOR' || u === 'ADMIN') return u;
  return '';
};

const col = (row, ...keys) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

const firmarToken = (usuario) =>
  jwt.sign(
    {
      IdUser: usuario.IdUser,
      Email: usuario.Email,
      PermisosUser: usuario.PermisosUser,
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );

const publicUser = (row) => ({
  IdUser: col(row, 'iduser', 'IdUser'),
  Email: col(row, 'email', 'Email'),
  Nombre: col(row, 'nombre', 'Nombre'),
  Comuna: col(row, 'comuna', 'Comuna'),
  PermisosUser: col(row, 'permisosuser', 'PermisosUser'),
});

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Token no enviado' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.PermisosUser !== 'ADMIN') {
    return res.status(403).json({ error: 'Se requiere rol ADMIN' });
  }
  return next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/', (_req, res) => {
  res.send('SIFCOM API funcionando');
});

app.get('/api/health', asyncHandler(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true, db: process.env.DB_NAME });
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const Email = body.Email ?? body.email;
  const Nombre = body.Nombre ?? body.nombre;
  const Comuna = body.Comuna ?? body.comuna;
  const Contrasena = body.Contrasena ?? body.contrasena ?? body.password;
  const rol = normalizeRol(body.PermisosUser ?? body.permisosuser ?? body.rol);

  if (!Email || !Nombre || !Comuna || !Contrasena || !rol) {
    return res.status(400).json({ error: 'Completa todos los campos' });
  }
  if (!emailOk(String(Email).trim())) {
    return res.status(400).json({ error: 'Correo inválido' });
  }
  if (!passwordOk(Contrasena)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres y un número' });
  }

  const existe = await pool.query(
    'SELECT 1 FROM usuario WHERE email = $1',
    [String(Email).trim().toLowerCase()],
  );
  if (existe.rowCount > 0) {
    return res.status(409).json({ error: 'El correo ya está registrado' });
  }

  const hash = await bcrypt.hash(Contrasena, 10);
  const inserted = await pool.query(
    `INSERT INTO usuario (email, nombre, comuna, contrasena, permisosuser)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING iduser, email, nombre, comuna, permisosuser`,
    [String(Email).trim().toLowerCase(), String(Nombre).trim(), String(Comuna).trim(), hash, rol],
  );

  res.status(201).json({ user: publicUser(inserted.rows[0]) });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const Email = body.Email ?? body.email;
  const Contrasena = body.Contrasena ?? body.contrasena ?? body.password;
  if (!Email || !Contrasena) {
    return res.status(400).json({ error: 'Completa correo y contraseña' });
  }

  const result = await pool.query(
    `SELECT iduser, email, nombre, comuna, contrasena, permisosuser
     FROM usuario WHERE email = $1`,
    [String(Email).trim().toLowerCase()],
  );
  if (result.rowCount === 0) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const usuario = result.rows[0];
  const hash = col(usuario, 'contrasena', 'Contrasena');
  const match = await bcrypt.compare(Contrasena, hash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const user = publicUser(usuario);
  res.json({ token: firmarToken(user), user });
}));

app.get('/api/contratos', requireAuth, asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT idcontrato, empresa, giro, presupuesto, vigencia
     FROM contrato ORDER BY idcontrato`,
  );
  res.json(result.rows);
}));

app.get('/api/contratos/:id', requireAuth, asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT idcontrato, empresa, giro, presupuesto, vigencia
     FROM contrato WHERE idcontrato = $1`,
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Contrato no encontrado' });
  }
  res.json(result.rows[0]);
}));

app.post('/api/contratos', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { Empresa, Giro, Presupuesto, Vigencia } = req.body || {};
  if (!Empresa || !Giro || Presupuesto == null || !Vigencia) {
    return res.status(400).json({ error: 'Completa Empresa, Giro, Presupuesto y Vigencia' });
  }
  const result = await pool.query(
    `INSERT INTO contrato (empresa, giro, presupuesto, vigencia)
     VALUES ($1, $2, $3, $4)
     RETURNING idcontrato, empresa, giro, presupuesto, vigencia`,
    [Empresa, Giro, Presupuesto, Vigencia],
  );
  res.status(201).json(result.rows[0]);
}));

app.put('/api/contratos/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { Empresa, Giro, Presupuesto, Vigencia } = req.body || {};
  if (!Empresa || !Giro || Presupuesto == null || !Vigencia) {
    return res.status(400).json({ error: 'Completa Empresa, Giro, Presupuesto y Vigencia' });
  }
  const result = await pool.query(
    `UPDATE contrato
     SET empresa = $1, giro = $2, presupuesto = $3, vigencia = $4
     WHERE idcontrato = $5
     RETURNING idcontrato, empresa, giro, presupuesto, vigencia`,
    [Empresa, Giro, Presupuesto, Vigencia, req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Contrato no encontrado' });
  }
  res.json(result.rows[0]);
}));

app.delete('/api/contratos/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const result = await pool.query(
    'DELETE FROM contrato WHERE idcontrato = $1 RETURNING idcontrato',
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Contrato no encontrado' });
  }
  res.status(204).send();
}));

app.get('/api/fiscalizaciones', requireAuth, asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT idfiscalizacion, obra, ubicacion, foto, observaciones,
            fechafisc, estado, iduser, idcontrato
     FROM fiscalizacion ORDER BY idfiscalizacion DESC`,
  );
  res.json(result.rows);
}));

app.get('/api/fiscalizaciones/:id', requireAuth, asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT idfiscalizacion, obra, ubicacion, foto, observaciones,
            fechafisc, estado, iduser, idcontrato
     FROM fiscalizacion WHERE idfiscalizacion = $1`,
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Fiscalización no encontrada' });
  }
  res.json(result.rows[0]);
}));

app.post('/api/fiscalizaciones', requireAuth, asyncHandler(async (req, res) => {
  const { Obra, Ubicacion, Foto, Observaciones, FechaFisc, Estado, IdContrato } = req.body || {};
  if (!Obra || !IdContrato) {
    return res.status(400).json({ error: 'Obra e IdContrato son obligatorios' });
  }
  const result = await pool.query(
    `INSERT INTO fiscalizacion
      (obra, ubicacion, foto, observaciones, fechafisc, estado, iduser, idcontrato)
     VALUES ($1, $2, $3, $4, COALESCE($5, NOW()), COALESCE($6, 'PENDIENTE'), $7, $8)
     RETURNING idfiscalizacion, obra, ubicacion, foto, observaciones,
               fechafisc, estado, iduser, idcontrato`,
    [Obra, Ubicacion || null, Foto || null, Observaciones || null, FechaFisc || null, Estado || null, req.user.IdUser, IdContrato],
  );
  res.status(201).json(result.rows[0]);
}));

app.put('/api/fiscalizaciones/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { Obra, Ubicacion, Foto, Observaciones, FechaFisc, Estado, IdUser, IdContrato } = req.body || {};
  if (!Obra || !IdContrato) {
    return res.status(400).json({ error: 'Obra e IdContrato son obligatorios' });
  }
  const result = await pool.query(
    `UPDATE fiscalizacion
     SET obra = $1, ubicacion = $2, foto = $3, observaciones = $4,
         fechafisc = $5, estado = $6, iduser = $7, idcontrato = $8
     WHERE idfiscalizacion = $9
     RETURNING idfiscalizacion, obra, ubicacion, foto, observaciones,
               fechafisc, estado, iduser, idcontrato`,
    [Obra, Ubicacion || null, Foto || null, Observaciones || null, FechaFisc || null, Estado || null, IdUser || req.user.IdUser, IdContrato, req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Fiscalización no encontrada' });
  }
  res.json(result.rows[0]);
}));

app.delete('/api/fiscalizaciones/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const result = await pool.query(
    'DELETE FROM fiscalizacion WHERE idfiscalizacion = $1 RETURNING idfiscalizacion',
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Fiscalización no encontrada' });
  }
  res.status(204).send();
}));

app.get('/api/multas', requireAuth, asyncHandler(async (_req, res) => {
  const result = await pool.query(
    `SELECT idmulta, monto, motivo, fechamulta, idcontrato, idfiscalizacion
     FROM multa ORDER BY idmulta DESC`,
  );
  res.json(result.rows);
}));

app.get('/api/multas/:id', requireAuth, asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT idmulta, monto, motivo, fechamulta, idcontrato, idfiscalizacion
     FROM multa WHERE idmulta = $1`,
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Multa no encontrada' });
  }
  res.json(result.rows[0]);
}));

app.post('/api/multas', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { Monto, Motivo, FechaMulta, IdContrato, IdFiscalizacion } = req.body || {};
  if (Monto == null || !Motivo || !IdContrato || !IdFiscalizacion) {
    return res.status(400).json({ error: 'Completa Monto, Motivo, IdContrato e IdFiscalizacion' });
  }
  const result = await pool.query(
    `INSERT INTO multa (monto, motivo, fechamulta, idcontrato, idfiscalizacion)
     VALUES ($1, $2, COALESCE($3, NOW()), $4, $5)
     RETURNING idmulta, monto, motivo, fechamulta, idcontrato, idfiscalizacion`,
    [Monto, Motivo, FechaMulta || null, IdContrato, IdFiscalizacion],
  );
  res.status(201).json(result.rows[0]);
}));

app.put('/api/multas/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { Monto, Motivo, FechaMulta, IdContrato, IdFiscalizacion } = req.body || {};
  if (Monto == null || !Motivo || !IdContrato || !IdFiscalizacion) {
    return res.status(400).json({ error: 'Completa Monto, Motivo, IdContrato e IdFiscalizacion' });
  }
  const result = await pool.query(
    `UPDATE multa
     SET monto = $1, motivo = $2, fechamulta = $3, idcontrato = $4, idfiscalizacion = $5
     WHERE idmulta = $6
     RETURNING idmulta, monto, motivo, fechamulta, idcontrato, idfiscalizacion`,
    [Monto, Motivo, FechaMulta || null, IdContrato, IdFiscalizacion, req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Multa no encontrada' });
  }
  res.json(result.rows[0]);
}));

app.delete('/api/multas/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const result = await pool.query(
    'DELETE FROM multa WHERE idmulta = $1 RETURNING idmulta',
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Multa no encontrada' });
  }
  res.status(204).send();
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || 'Error interno del servidor',
    message: err.message,
  });
});

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuario (
      iduser SERIAL PRIMARY KEY,
      email VARCHAR(120) UNIQUE NOT NULL,
      nombre VARCHAR(120) NOT NULL,
      comuna VARCHAR(80) NOT NULL,
      contrasena TEXT NOT NULL,
      permisosuser VARCHAR(20) NOT NULL
        CHECK (permisosuser IN ('ADMIN', 'INSPECTOR'))
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contrato (
      idcontrato SERIAL PRIMARY KEY,
      empresa VARCHAR(160) NOT NULL,
      giro VARCHAR(160) NOT NULL,
      presupuesto NUMERIC(14, 0) NOT NULL,
      vigencia DATE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS checklist (
      idchecklist SERIAL PRIMARY KEY,
      descripcion VARCHAR(200) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS itemschecklist (
      idchecklist INTEGER NOT NULL REFERENCES checklist(idchecklist) ON DELETE CASCADE,
      idcontrato INTEGER NOT NULL REFERENCES contrato(idcontrato) ON DELETE CASCADE,
      PRIMARY KEY (idchecklist, idcontrato)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS fiscalizacion (
      idfiscalizacion SERIAL PRIMARY KEY,
      obra VARCHAR(200) NOT NULL,
      ubicacion TEXT,
      foto TEXT,
      observaciones TEXT,
      fechafisc TIMESTAMP NOT NULL DEFAULT NOW(),
      estado VARCHAR(40) NOT NULL DEFAULT 'PENDIENTE',
      iduser INTEGER NOT NULL REFERENCES usuario(iduser),
      idcontrato INTEGER NOT NULL REFERENCES contrato(idcontrato)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS multa (
      idmulta SERIAL PRIMARY KEY,
      monto NUMERIC(14, 0) NOT NULL,
      motivo TEXT NOT NULL,
      fechamulta TIMESTAMP NOT NULL DEFAULT NOW(),
      idcontrato INTEGER NOT NULL REFERENCES contrato(idcontrato),
      idfiscalizacion INTEGER NOT NULL REFERENCES fiscalizacion(idfiscalizacion) ON DELETE CASCADE
    )
  `);

  const contratos = await pool.query('SELECT COUNT(*)::int AS n FROM contrato');
  if (contratos.rows[0].n === 0) {
    const inserted = await pool.query(`
      INSERT INTO contrato (empresa, giro, presupuesto, vigencia) VALUES
        ('Arauco Mantenciones S.A.', 'Contrato Áreas Verdes', 120000000, '2026-12-31'),
        ('LimpiaMar Ltda.', 'Camiones de Aseo', 210000000, '2026-12-31'),
        ('Constructora Pacifico', 'Contrato Remodelación', 320000000, '2026-12-31'),
        ('ElectroValpo SpA', 'Contrato Iluminaria Pública', 200000000, '2026-12-31')
      RETURNING idcontrato
    `);

    const checks = await pool.query('SELECT COUNT(*)::int AS n FROM checklist');
    if (checks.rows[0].n === 0) {
      const items = await pool.query(`
        INSERT INTO checklist (descripcion) VALUES
          ('Cumplimiento de horario'),
          ('Implementos de seguridad'),
          ('Calidad del servicio')
        RETURNING idchecklist
      `);
      for (const contrato of inserted.rows) {
        for (const item of items.rows) {
          await pool.query(
            'INSERT INTO itemschecklist (idchecklist, idcontrato) VALUES ($1, $2)',
            [item.idchecklist, contrato.idcontrato],
          );
        }
      }
    }
  } else {
    const checks = await pool.query('SELECT COUNT(*)::int AS n FROM checklist');
    if (checks.rows[0].n === 0) {
      await pool.query(`
        INSERT INTO checklist (descripcion) VALUES
          ('Cumplimiento de horario'),
          ('Implementos de seguridad'),
          ('Calidad del servicio')
      `);
    }
  }

  const fisc = await pool.query('SELECT COUNT(*)::int AS n FROM fiscalizacion');
  if (fisc.rows[0].n === 0) {
    const user = await pool.query('SELECT iduser FROM usuario ORDER BY iduser LIMIT 1');
    const contratosSeed = await pool.query('SELECT idcontrato FROM contrato ORDER BY idcontrato LIMIT 2');
    if (user.rowCount > 0 && contratosSeed.rowCount >= 1) {
      const idUser = user.rows[0].iduser;
      const c1 = contratosSeed.rows[0].idcontrato;
      const c2 = contratosSeed.rows[1]?.idcontrato ?? c1;
      await pool.query(
        `INSERT INTO fiscalizacion (obra, ubicacion, foto, observaciones, fechafisc, estado, iduser, idcontrato)
         VALUES
           ($1, $2, NULL, $3, NOW(), $4, $5, $6),
           ($7, $2, NULL, $8, NOW(), $9, $5, $10)`,
        [
          "Plaza O'Higgins",
          'Ubicación GPS Detectada (-33.045, -71.619)',
          'Alerta de incumplimiento',
          'ALERTA',
          idUser,
          c1,
          'Calle Las Heras',
          'Cumple / Sin observaciones',
          'CUMPLE',
          c2,
        ],
      );
    }
  }
};

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SIFCOM API en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar la API:', err.message);
    process.exit(1);
  });
