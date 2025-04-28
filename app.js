import express from 'express'
import { initializeDB, dbAll, dbRun } from './util/database.js';
import cors from 'cors'
import bodyParser from 'body-parser';

const app = express();

app.use(cors())
app.use(express.json());
app.use(bodyParser.json())

app.get('/album', async (req, res) => {
    const rows = await dbAll('SELECT * FROM albums')
    res.json(rows)
})

app.get('/album/:id', async (req, res) => {
    const rows = await dbAll('SELECT * FROM albums WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Nincs ilyen album');
    res.json(rows[0]);
  });

app.post('/album', async (req, res) => {
    const { zenekar, zenecim, kiadaseve, hossza } = req.body;
    await dbRun(
      `INSERT INTO albums (zenekar, zenecim, kiadaseve, hossza) VALUES (?, ?, ?, ?)`,
      [zenekar, zenecim, kiadaseve, hossza]
    );
    res.sendStatus(201);
});

app.put('/album/:id', async (req, res) => {
    const {zenekar, zenecim, kiadaseve, hossza} = req.body
    await dbRun(
        `UPDATE albums SET zenekar=?, zenecim=?, kiadaseve=?, hossza=? WHERE id=?`,
        [zenekar, zenecim, kiadaseve, hossza, req.params.id]
    )
    res.sendStatus(200)
})

app.delete('/album/:id', async (req, res) => {
    await dbRun('DELETE FROM albums WHERE id = ?', [req.params.id]);
    res.sendStatus(200);
});

async function startServer(){
    await initializeDB();
    app.listen(3000, () => {
        console.log("Server runs on port 3000")
    });
}

startServer();