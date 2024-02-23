// database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('github_repos.db');

const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS repos (
        id INTEGER PRIMARY KEY,
        name TEXT,
        full_name TEXT,
        description TEXT,
        owner_avatar_url TEXT,
        visibility TEXT,
        is_private INTEGER
      );`
    );
  });
};

const saveReposToDatabase = (repos) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM repos'); // Clear existing data
    repos.forEach(repo => {
      tx.executeSql(
        `INSERT INTO repos (name, full_name, description, owner_avatar_url, visibility, is_private)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [repo.name, repo.full_name, repo.description, repo.owner.avatar_url, repo.visibility, repo.private ? 1 : 0]
      );
    });
  });
};

const getReposFromDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM repos',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export { initDatabase, saveReposToDatabase, getReposFromDatabase };
