<?php
include_once '../php/pdo.php';

class Game
{
    public function __construct($result)
    {
        $this->gameID = $result->id;
        $this->nom = $result->name;
    }

    public static function findAll()
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM currentGames';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            $list = [];
            while ($result = $stmt->fetch()) {
                $list[] = new Game($result);
            }
            return $list;
        } catch (PDOException $e) {
            // Affichage de l'erreur et rappel de la requête.
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public static function insert($nom)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'INSERT INTO currentGames(name)
            VALUES(:nom)';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':nom' => $nom);

        try {
            $stmt->execute($parameters);
            return true;

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public function __toString()
    {
        return $this->nom;
    }

    public function getGameID()
    {
        return $this->gameID;
    }


    public function setGameID($gameID)
    {
        $this->gameID = $gameID;
        return $this;
    }


    public function getNom()
    {
        return $this->nom;
    }


    public function setNom($nom)
    {
        $this->nom = $nom;
        return $this;
    }


}