<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "sql101.infinityfree.com";
$db_name = "if0_41807788_web_gamf_db";
$username = "if0_41807788";
$password = "e3kLmeN7zEF3S";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $conn->prepare("SELECT id, aname, species FROM animals ORDER BY id DESC");
            $stmt->execute();
            $animals = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($animals);
        } catch(PDOException $e) {
            echo json_encode(["error" => "Failed to fetch data: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->aname) && !empty($data->species)) {
            try {
                $stmt = $conn->prepare("INSERT INTO animals (aname, species) VALUES (:aname, :species)");
                $stmt->bindParam(":aname", $data->aname);
                $stmt->bindParam(":species", $data->species);
                if($stmt->execute()) {
                    echo json_encode(["message" => "Animal created successfully.", "id" => $conn->lastInsertId()]);
                } else {
                    echo json_encode(["error" => "Failed to create animal."]);
                }
            } catch(PDOException $e) {
                echo json_encode(["error" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["error" => "Incomplete data. Both name and species are required."]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->id) && !empty($data->aname) && !empty($data->species)) {
            try {
                $stmt = $conn->prepare("UPDATE animals SET aname = :aname, species = :species WHERE id = :id");
                $stmt->bindParam(":id", $data->id);
                $stmt->bindParam(":aname", $data->aname);
                $stmt->bindParam(":species", $data->species);
                if($stmt->execute()) {
                    echo json_encode(["message" => "Animal updated successfully."]);
                } else {
                    echo json_encode(["error" => "Failed to update animal."]);
                }
            } catch(PDOException $e) {
                echo json_encode(["error" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["error" => "Incomplete data. ID, name, and species are required."]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($data->id) ? $data->id : null);
        
        if($id) {
            try {
                $stmt = $conn->prepare("DELETE FROM animals WHERE id = :id");
                $stmt->bindParam(":id", $id);
                if($stmt->execute()) {
                    echo json_encode(["message" => "Animal deleted successfully."]);
                } else {
                    echo json_encode(["error" => "Failed to delete animal."]);
                }
            } catch(PDOException $e) {
                echo json_encode(["error" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["error" => "No ID provided for deletion."]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid request method."]);
        break;
}
?>
