import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []){
    return new Promise((resolve, reject) =>{
        db.all(sql, params, (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []){
    return new Promise((resolve, reject) =>{
        db.get(sql, params, (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbRun(sql, params = []){
    return new Promise((resolve, reject) =>{
        db.run(sql, params, function(err) {
            if(err) reject(err);
            else resolve();
        });
    });
}

export async function initializeDB(){
    await dbRun("DROP TABLE IF EXISTS albums;");
    await dbRun("CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY AUTOINCREMENT, zenekar STRING, zenecim STRING, kiadaseve INT, hossza STRING);")
        const albums = [
            {zenekar: "Smash Into Pieces", zenecim: "All Eyes On You", kiadaseve: 2020, hossza: "3:07"},
            {zenekar: "Connor Kauffman", zenecim: "Echoes", kiadaseve: 2024, hossza: "2:41"},
            {zenekar: "Smash Into Pieces", zenecim: "Trigger", kiadaseve: 2024, hossza: "2:57"},
            {zenekar: "Paddy And The Rats", zenecim: "One Last Ale", kiadaseve: 2018, hossza: "3:10"},
            {zenekar: "Jim Yosef", zenecim: "Devil's Lullaby (ft. Scarlett)", kiadaseve: 2024, hossza: "2:55"},
            {zenekar: "Two Steps From Hell", zenecim: "Star Sky", kiadaseve: 2015, hossza: "5:34"},
            {zenekar: "Two Steps From Hell", zenecim: "Victory", kiadaseve: 2016, hossza: "5:28"},
            {zenekar: "HAVASI", zenecim: "Prelude | Age of Heroes", kiadaseve: 2016, hossza: "6:24"},
            {zenekar: "HAVASI", zenecim: "Rise of the Instruments", kiadaseve: 2016, hossza: "3:07"},
        ]
    for(const alb of albums){
        await dbRun("INSERT INTO albums (zenekar, zenecim, kiadaseve, hossza) VALUES (?, ?, ?, ?);", [alb.zenekar, alb.zenecim, alb.kiadaseve, alb.hossza]);
    }
}