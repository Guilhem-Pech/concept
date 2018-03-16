<?php
/**
 * Created by PhpStorm.
 * User: guilh
 * Date: 16/03/2018
 * Time: 22:36
 */

class Word
{
    public function __construct($result)
    {
        $this->id = $result->id;
        $this->word = $result->word;
    }

    public static function getById($id)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM Word WHERE id = :id';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        $stmt->bindValue('id', $id, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            while ($result = $stmt->fetch()) {
                return new Word($result);
            }
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function getRandom()
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM Word ORDER BY rand() LIMIT 1';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            while ($result = $stmt->fetch()) {
                return new Word($result);
            }
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }
}