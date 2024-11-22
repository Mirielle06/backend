const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors"); // Importation de CORS

const app = express();
const PORT = 5009;

// Middleware
app.use(cors()); // Activation de CORS
app.use(bodyParser.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ten iz"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("Connecté à la base de données MySQL !");
});

// Route pour insérer des données
app.post("/data", (req, res) => {
  // Obtenir DISTANCE ET POURCENTAGE
  const distance = req.body.distance;
  const pourcentage = req.body.pourcentage;

  // Obtenir la date et l'heure actuelles
  const dateCreation = new Date().toISOString().split('T')[0]; // Récupère la date (AAAA-MM-JJ)
  const heureCreation = new Date().toISOString().split('T')[1].split('.')[0]; // Récupère l'heure (HH:MM:SS)

  // Vérification des données
  if (distance == null || pourcentage == null || dateCreation == null || heureCreation == null) {
    return res.status(400).json({ message: "Données invalides" });
  }

  // Requête d'insertion
  const query = "INSERT INTO distance (distance, pourcentage, date, heure) VALUES (?, ?, ?, ?)";
  db.query(query, [distance, pourcentage, dateCreation, heureCreation], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err);
      return res.status(500).json({ message: "Erreur lors de l'insertion des données" });
    }

    console.log("Données insérées :", { distance, pourcentage });
    res.status(200).json({ message: "Données enregistrées avec succès !" });
  });
});

// Route pour récupérer les données
app.get("/datadata", (req, res) => {
  const query = "SELECT id, distance, pourcentage, date, heure FROM distance ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération :", err);
      return res.status(500).json({ message: "Erreur lors de la récupération des données" });
    }
    console.log("Données récupérées :", results);
    res.status(200).json(results);
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
