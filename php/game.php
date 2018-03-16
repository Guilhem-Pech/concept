<?php
include_once '../php/pdo.php';
include_once '../php/playingUsers.php';
include_once '../php/word.php';

class Game
{
    public function __construct($result)
    {
        $this->gameID = $result->id;
        $this->nom = $result->name;
        $this->guesser = playingUsers::findByID($result->guesser);
        $this->word = Word::getById($result->wordToGuess);
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

    public static function setGuesser($id, $guesser)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'UPDATE currentGames SET guesser=:guesser WHERE id=:id';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':id' => $id, ':guesser' => $guesser);

        try {
            $stmt->execute($parameters);
            return intval($pdo->lastInsertId());

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public static function findByID($id)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM currentGames WHERE id = :id';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        $stmt->bindValue('id', $id, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            while ($result = $stmt->fetch()) {
                return new Game($result);
            }
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function insert($nom, $guesser)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'INSERT INTO currentGames(name,guesser)
            VALUES(:nom,:guesser)';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':nom' => $nom, ':guesser' => $guesser);

        try {
            $stmt->execute($parameters);
            return intval($pdo->lastInsertId());

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public static function setWordRandom($id)
    {
        $randomWord = Word::getRandom();
        $sql = 'UPDATE currentGames SET wordToGuess =' . $randomWord->id . ' WHERE id=:id';
        $pdo = MyPdo::getConnection();
        $stmt = $pdo->prepare($sql);

        $parameters = array(':id' => $id,);

        try {
            $stmt->execute($parameters);
            return intval($pdo->lastInsertId());

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public static function remove($GAME_ID)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'DELETE FROM currentGames WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':id' => $GAME_ID);

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