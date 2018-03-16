<?php

include_once '../php/pdo.php';

class playingUsers
{
    public function __construct($result)
    {
        $this->id = $result->id;
        $this->playername = $result->playername;
        $this->game = $result->game;
        $this->timeconnect = $result->timeConnect;
    }

    public static function countPlayerByGame($id)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT COUNT(DISTINCT id) numberOfPlayers  FROM playingUsers WHERE game = :id';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        $stmt->bindValue('id', $id, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            while ($result = $stmt->fetch()) {
                return $result;
            }
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function findByID($id)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM playingUsers WHERE id = :id';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        $stmt->bindValue('id', $id, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            while ($result = $stmt->fetch()) {
                return new playingUsers($result);
            }
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function insert($nom)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'INSERT INTO playingUsers(playername)
            VALUES(:nom)';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':nom' => $nom);

        try {
            if ($stmt->execute($parameters))
                return $pdo->lastInsertId();
            else
                throw new PDOException("Something went wrong");

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }

    }

    public static function setGame($id, $game)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'UPDATE playingUsers SET game=:game WHERE id=:id';
        $stmt = $pdo->prepare($sql);
        $parameters = array(':game' => $game, ':id' => $id);
        try {
            return $stmt->execute($parameters);

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }

    public static function remove($id)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'DELETE FROM playingUsers WHERE id=:id';
        $stmt = $pdo->prepare($sql);
        $parameters = array(':id' => $id);
        try {
            return $stmt->execute($parameters);

        } catch (PDOException $e) {
            echo 'Erreur : ', $e->getMessage(), PHP_EOL;
            echo 'Requête : ', $sql, PHP_EOL;
            exit();
        }
    }
}