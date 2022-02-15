<?php include('../config/constant.php'); ?>
<div>
    <div>
        <h1>Add food</h1>

        <br><br>

        <form action="" method="POST">
            <table>
                <tr>
                    <td>Category Name: </td>
                    <td>
                        <input type="text" name="category_name" placeholder="Enter food name">
                    </td>
                </tr>
                <tr>
                    <td colspan='2'>
                        <input type="submit" name="submit" value="Add Category">
                    </td>
                </tr>
            </table>
    </div>
</div>

<?php

    if(isset($_POST['submit']))
    {
        $category_name = $_POST['category_name'];

       $sql = "INSERT INTO category SET
            category_name='$category_name'";
        
        $res = mysqli_query($conn,$sql) or die(mysqli_error());

        if($res)
        {
            echo "data inserted";
        }
        else
        {
            echo "data failed insert";
        }
    }


?>

