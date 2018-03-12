<?php
include_once '../php/pdo.php';
    class Jeton {
        private $id;
        private $image;

        public function __construct($result) {
            $this->id   = $result->id;
            $this->image   = $result->image;
        }

        public static function findAll() {
            $pdo = MyPdo::getConnection();
            $sql = 'SELECT *  FROM Jeton';
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
                    $list[] = new Jeton($result);
                }
                return $list;
            }
            catch (PDOException $e)
            {
                // Affichage de l'erreur et rappel de la requête.
                echo 'Erreur : ', $e->getMessage(), PHP_EOL;
                echo 'Requête : ', $sql, PHP_EOL;
                exit();
            }
        }

        public static function insert($image) {
            $pdo = MyPdo::getConnection();
            $sql = 'INSERT INTO Jeton(image)
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
