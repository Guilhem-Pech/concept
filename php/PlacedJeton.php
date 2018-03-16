<?php
include_once '../php/pdo.php';
include_once '../php/game.php';
include_once '../php/jeton.php';
include_once '../php/concept.php';

class PlacedJeton
{
    public function __construct($result)
    {

        $this->conceptID = Concept::findByID($result->conceptID);
        $this->jetonID = Jeton::findByID($result->jetonID);
        $this->gameID = Game::findByID($result->gameID);
    }

    public static function findAllByGame($gameID)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'SELECT *  FROM PlacedJeton WHERE gameID= :gameID';
        $stmt = $pdo->prepare($sql); // Préparation d'une requête.
        $stmt->bindValue('gameID', $gameID, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
        try {
            $stmt->execute(); // Exécution de la requête.
            if ($stmt->rowCount() == 0) {
                return null;
            }
            $stmt->setFetchMode(PDO::FETCH_OBJ);
            $list = [];
            while ($result = $stmt->fetch()) {
                $list[] = new PlacedJeton($result);
            }
            return $list;
        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function insertJetonOnConcept($gameID, $Concept, $Jeton)
    {
        $ConceptID = $Concept;
        $JetonID = $Jeton;
        if (is_string($Concept)) {
            $ConceptID = Concept::findByImage($Concept)->getID();
        }
        if (is_string($Jeton)) {
            $JetonID = Jeton::findByImage($Jeton)->getID();
        }

        $pdo = MyPdo::getConnection();
        $sql = 'INSERT INTO PlacedJeton(gameID, conceptID, jetonID)
            VALUES(:gameID,:conceptID,:jetonID) ON DUPLICATE KEY UPDATE jetonID = :jetonID';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':gameID' => $gameID, ':conceptID' => $ConceptID, ':jetonID' => $JetonID);

        try {
            $stmt->execute($parameters);
            return true;

        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }

    }

    public static function removeJetonOnConcept($gameID, $Concept)
    {
        $ConceptID = $Concept;
        if (is_string($Concept)) {
            $ConceptID = Concept::findByImage($Concept)->getID();
        }
        $pdo = MyPdo::getConnection();
        $sql = 'DELETE FROM PlacedJeton WHERE gameID=:gameID AND conceptID = :conceptID';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':gameID' => $gameID, ':conceptID' => $ConceptID);

        try {
            $stmt->execute($parameters);
            return true;

        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public static function removeAllJetonByGame($gameID)
    {
        $pdo = MyPdo::getConnection();
        $sql = 'DELETE FROM PlacedJeton WHERE gameID=:gameID';
        $stmt = $pdo->prepare($sql);

        $parameters = array(':gameID' => $gameID);

        try {
            $stmt->execute($parameters);
            return true;

        } catch (PDOException $e) {
            return "Something went wrong: " . $e->getMessage();
        }
    }

    public function getConceptID()
    {
        return $this->conceptID;
    }

    public function setConceptID($conceptID)
    {
        $this->conceptID = $conceptID;
        return $this;
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

    public function getJetonID()
    {
        return $this->jetonID;
    }

    public function setJetonID($jetonID)
    {
        $this->jetonID = $jetonID;
        return $this;
    }


}