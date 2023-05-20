<?php
    function yell($obj)
    {
        try
        {
            echo '<pre>';
            print_r($obj->__toString());
            echo '</pre>';
        }
        catch(Error $e)
        {
            echo '<pre>';
            print_r($obj);
            echo '</pre>';
        }
        
    }


    class Matrix
    {
        // fields
        private array $arr;
        private int $nrow;
        private int $ncol;

        // constructor
        public function __construct(int $rows, int $columns)
        {
            $this->arr = array();
            for($i = 0; $i < $rows; $i++) 
            {
                $this->arr[] = array();
                for($j = 0; $j < $columns; $j++) 
                {
                    $this->arr[$i][] = 0.0;
                }
            }

            $this->nrow = $rows;
            $this->ncol = $columns;
        }

        // methods
        public function __toString()
        {
            $str = '';
            foreach($this->arr as $row)
            {
                $str .= '[';
                foreach($row as $item)
                {
                    $str .= ' ' . $item . ' ';
                }
                $str .= ']' . PHP_EOL;
            }
            return $str;
        }

        public function getRow(int $i)
        {
            return $this->arr[$i -1];
        }

        public function setRow(int $i, array $values)
        {
            if(count($values) !== $this->ncol)
                throw new MatrixException('Invalid number of arguments, tried to add ' . count($values) . ' arguments and the matrix row supports ' . $this->ncol);
            
            $this->arr[$i -1] = $values;
        }

        public function getCol(int $j)
        {
            $col = array();
            foreach($this->arr as $row)
            {
                $col[] = $row[$j - 1];
            }
            return $col;
        }

        public function setCol(int $j, array $values)
        {
            if(count($values) !== $this->nrow)
                throw new MatrixException('Invalid number of arguments, tried to add ' . count($values) . ' arguments and the matrix column supports ' . $this->nrow);
            
            for($i = 0; $i < count($this->arr); $i++)
            {
                $this->arr[$i][$j - 1] = $values[$i];
            }
        }
    }

    class MatrixException extends Exception
    {
        public function __construct(string $message)
        {
            parent::__construct($message);
        }
    }

    $mat = new Matrix(5, 5);
    $mat->setCol(1, [1, 2, 3, 4]);
    yell($mat);
    
?>