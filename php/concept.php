<?php
include_once '../php/pdo.php';
    class Concept {
        public function __construct($result) {
            $this->id   = $result->id;
            $this->image   = $result->image;
        }

        public static function findByID($id)
        {
            $pdo = MyPdo::getConnection();
            $sql = 'SELECT *  FROM Concept WHERE id = :id';
            $stmt = $pdo->prepare($sql); // Préparation d'une requête.
            $stmt->bindValue('id', $id, PDO::PARAM_INT); // Lie les paramètres de manière sécurisée.
            try {
                $stmt->execute(); // Exécution de la requête.
                if ($stmt->rowCount() == 0) {
                    return null;
                }
                $stmt->setFetchMode(PDO::FETCH_OBJ);
                while ($result = $stmt->fetch()) {
                    return new Concept($result);
                }
            } catch (PDOException $e) {
                return "Something went wrong: " . $e->getMessage();
            }
        }

        public static function findByImage($path)
        {
            $pdo = MyPdo::getConnection();
            $sql = 'SELECT *  FROM Concept WHERE image = :image';
            $stmt = $pdo->prepare($sql); // Préparation d'une requête.
            $stmt->bindValue('image', $path, PDO::PARAM_STR); // Lie les paramètres de manière sécurisée.
            try {
                $stmt->execute(); // Exécution de la requête.
                if ($stmt->rowCount() == 0) {
                    return null;
                }
                $stmt->setFetchMode(PDO::FETCH_OBJ);
                while ($result = $stmt->fetch()) {
                    return new Concept($result);
                }
            } catch (PDOException $e) {
                return "Something went wrong: " . $e->getMessage();
            }
        }

        public static function findAll() {
            $pdo = MyPdo::getConnection();
            $sql = 'SELECT *  FROM Concept';
            $stmt = $pdo->prepare($sql); // Préparation d'une requête.
            try
            {
                $stmt->execute(); // Exécution de la requête.
                if ($stmt->rowCount() == 0) {
                    return null;
                }
                $stmt->setFetchMode(PDO::FETCH_OBJ);
                $list = [];
                while ($result = $stmt->fetch())
                {
                    $list[] = new Concept($result);
                }
                return $list;
            }
            catch (PDOException $e)
            {
                return "Something went wrong: " . $e->getMessage();
            }
        }

        public static function insert($image) {
            $pdo = MyPdo::getConnection();
            $sql = 'INSERT INTO Concept(image)
            VALUES(:image)';
            $stmt = $pdo->prepare($sql);

            $parameters = array(':image' => $image );

            try {
                $stmt->execute($parameters);
                return true;

            } catch (PDOException $e) {
                echo 'Erreur : ', $e->getMessage(), PHP_EOL;
                echo 'Requête : ', $sql, PHP_EOL;
                exit();
            }
        }
        public function __toString(){
          return $this->image;
        }

        public function getImage()
        {
            return $this->image;
        }

        public function setImage($image)
        {
            $this->image = $image;

            return $this;
        }

        public function getID()
        {
            return $this->id;
        }

        public function setID($id)
        {
            $this->lang = $id;

            return $this;
        }

}

?>
