<?php
    class MyPdo {
        public static function getConnection() {
            try {// Connexion à la base de données.
                $dsn = 'mysql:host=mysql-concept-the-game.alwaysdata.net;dbname=concept-the-game_database';
                $pdo = new PDO($dsn, '154208', 'admin');
                // Codage de caractères.
                $pdo->exec('SET CHARACTER SET utf8');
                // Gestion des erreurs sous forme d'exceptions.
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            } catch(PDOException $e)
            {
                die('Erreur : ' . $e->getMessage());
            }
        }
    }
