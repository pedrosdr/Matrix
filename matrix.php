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

        // factory methods
        public static function fromArray(array $arr)
        {
            $mat = new Matrix(count($arr), count($arr[0]));
            for($i = 0; $i < count($arr); $i++)
            {
                for($j = 0; $j < count($arr[$i]); $j++)
                {
                    $mat->arr[$i][$j] = $arr[$i][$j];
                }
            }
            return $mat;
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

        public function get($i, $j)
        {
            return $this->arr[$i - 1][$j - 1];
        }

        public function set($i, $j, $value)
        {
            $this->arr[$i - 1][$j - 1] = $value;
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

        public function minor($i, $j)
        {
            if($this->nrow == 1 || $this->ncol == 1)
                throw new MatrixException('Error getting minor: Matrix must not have only 1 row or column');
            
            $mat = new Matrix($this->nrow - 1, $this->ncol - 1);
            $rowIndex = 1;
            foreach($this->arr as $x => $row)
            {
                if($x == $i - 1) continue;
                $matRow = array();
                foreach($row as $y => $item)
                {
                    if($y == $j - 1) continue;
                    $matRow[] = $item;
                }
                $mat->setRow($rowIndex, $matRow);
                $rowIndex++;
            }
            return $mat;
        }

        public function D($i, $j)
        {
            return $this->minor($i, $j)->det();
        }

        public function C($i, $j)
        {
            return pow(-1, $i + $j) * $this->D($i, $j);
        }

        public function det()
        {
            if($this->nrow != $this->nrow)
                throw new MatrixException('Error computing determinant: Matrix must be square');
            
            $n = $this->nrow;

            if($n == 1)
                return $this->arr[0][0];

            $sum = 0;
            for($j = 0; $j < $n; $j++)
            {
                $sum += $this->arr[0][$j] * $this->C(1, $j + 1);
            }
            return $sum;
        }

        public function T()
        {
            $mat = new Matrix($this->ncol, $this->nrow);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($j, $i, $this->get($i, $j));
                }
            }
            return $mat;
        }

        public function matrixOfCofactors()
        {
            $mat = new Matrix($this->nrow, $this->ncol);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($i, $j, $this->C($i, $j));
                }
            }
            return $mat;
        }
    }

    class MatrixException extends Exception
    {
        public function __construct(string $message)
        {
            parent::__construct($message);
        }
    }

    $mat = Matrix::fromArray([[1],
                              [4],
                              [3]]);

    yell($mat->minor(2, 2));
?>