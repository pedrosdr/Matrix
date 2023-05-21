<?php
    /**********************************************
    * Script created by Pedro Sartori Dias dos Reis
    * GitHub: https://github.com/pedrosdr
    **********************************************/

    class Matrix
    {
        /*
               1     2     3  _  N

        1     a11  a12  a13  _  a1N
        2     a21  a22  a23  _  a2N
        3     a31  a32  a33  _  a3N
        |      |    |    |   \   |
        N     aN1  aN2  aN3  _  aNN
        */

        // constructor

        // fields
        private array $arr;
        private int $nrow;
        private int $ncol;

        // constructor

        /*
        * Generates a Matrix using a number of rows and columns
        * rows and columns -> integer
        */
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

        /*
        * Generates a Matrix using an Array
        * returns -> Matrix
        */
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

        /*
        * Generates an Identity Matrix
        * size -> integer
        * returns -> Matrix
        */
        public static function I($size)
        {
            $mat = new Matrix($size, $size);
            for($i = 1; $i <= $size; $i++)
            {
                $mat->set($i, $i, 1);
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

        /*
        * Returns the value at row (i) and column (j)
        * i and j start at 1
        * i and j -> integer
        * returns -> number
        */
        public function get(int $i, int $j)
        {
            return $this->arr[$i - 1][$j - 1];
        }

        /*
        * Sets a value to row (i) and column (j)
        * i and j start at 1
        * i and j -> integer
        * value -> number
        * no return
        */
        public function set(int $i, int $j, $value)
        {
            $this->arr[$i - 1][$j - 1] = $value;
        }

        /*
        * Returns an Array containing the row of index i
        * i starts at 1
        * i -> integer
        * returns -> Array
        */
        public function getRow(int $i)
        {
            return $this->arr[$i -1];
        }

        /*
        * Sets a row at index i
        * i starts at 1
        * i -> integer
        * values -> Array
        * no return
        */
        public function setRow(int $i, array $values)
        {
            if(count($values) !== $this->ncol)
                throw new MatrixException('Invalid number of arguments, tried to add ' . count($values) . ' arguments and the matrix row supports ' . $this->ncol);
            
            $this->arr[$i -1] = $values;
        }

        /*
        * Returns an Array containing the columns of index j
        * j starts at 1
        * j -> integer
        * returns -> Array
        */
        public function getCol(int $j)
        {
            $col = array();
            foreach($this->arr as $row)
            {
                $col[] = $row[$j - 1];
            }
            return $col;
        }

        /*
        * Sets a row at index j
        * j starts at 1
        * j -> integer
        * values -> Array
        * no return
        */
        public function setCol(int $j, array $values)
        {
            if(count($values) !== $this->nrow)
                throw new MatrixException('Invalid number of arguments, tried to add ' . count($values) . ' arguments and the matrix column supports ' . $this->nrow);
            
            for($i = 0; $i < count($this->arr); $i++)
            {
                $this->arr[$i][$j - 1] = $values[$i];
            }
        }

        /*
        * Returns the Minor matrix of row i and column j
        * i and j start at 1
        * i and j -> integer
        * returns -> Matrix
        */
        public function minor(int $i, int $j)
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

        /*
        * Returns the Determinant of the Minor matrix of row i and column j
        * i and j start at 1
        * i and j -> integer
        * returns -> number
        */
        public function D(int $i, int $j)
        {
            return $this->minor($i, $j)->det();
        }

        /*
        * Returns the Cofactor of row i and column j
        * i and j start at 1
        * i and j -> integer
        * returns -> number
        */
        public function C(int $i, int $j)
        {
            return pow(-1, $i + $j) * $this->D($i, $j);
        }

        /*
        * Returns the Determinant of the matrix
        * returns -> number
        */
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

        /*
        * Returns the Transpose of the matrix
        * returns -> Matrix
        */
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

        /*
        * Returns the Inverse of the matrix
        * returns -> Matrix
        */
        public function inv()
        {
            return $this->matrixOfCofactors()->T()->mult_sc(1/$this->det());
        }

        /*
        * Returns a new Matrix formed by the cofactors of the current Matrix
        * returns -> Matrix
        */
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

        /*
        * Multiplies the matrix by a scalar
        * k -> number
        * returns -> Matrix
        */
        public function mult_sc($k)
        {
            $mat = new Matrix($this->nrow, $this->ncol);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($i, $j, $this->get($i, $j) * $k);
                }
            }
            return $mat;
        }

        /*
        * Divides the matrix by a scalar
        * k -> number
        * returns -> Matrix
        */
        public function div_sc($k)
        {
            return $this->mult_sc(1/$k);
        }

        /*
        * Scalar addition
        * k -> number
        * returns -> Matrix
        */
        public function add_sc($k)
        {
            $mat = new Matrix($this->nrow, $this->ncol);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($i, $j, $this->get($i, $j) + $k);
                }
            }
            return $mat;
        }

        /*
        * Scalar subtraction
        * k -> number
        * returns -> Matrix
        */
        public function sub_sc($k)
        {
            return $this->add_sc(-$k);
        }

        /*
        * Multiplies the matrix by other matrix
        * other -> Matrix
        * returns -> Matrix
        */
        public function mult(Matrix $other)
        {
            if($this->ncol != $other->nrow)
                throw new MatrixException('Cannot multiply matrices: NUMBER OF COLUMNS of the first is DIFFERENT from the NUMBER OF ROWS of the second');

            $mat = new Matrix($this->nrow, $other->ncol);

            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $other->ncol; $j++)
                {
                    $a = 0;
                    for($k = 1; $k <= $other->nrow; $k++)
                    {
                        $a += $this->get($i, $k) * $other->get($k, $j);
                    }
                    $mat->set($i, $j, $a);
                }
            }
            return $mat;
        }

        /*
        * Divides the matrix by other matrix
        * other -> Matrix
        * returns -> Matrix
        */
        public function div(Matrix $other)
        {
            return $this->mult($other->inv());
        }

        /*
        * Matrix addition
        * other -> Matrix
        * returns -> Matrix
        */
        public function add(Matrix $other)
        {
            if($this->nrow != $other->nrow || $this->ncol != $other->ncol)
                throw new MatrixException('Cannot sum matrices: Matrices must have the SAME NUMBER of ROWS and COLUMNS');

            $mat = new Matrix($this->nrow, $this->ncol);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($i, $j, $this->get($i, $j) + $other->get($i, $j));
                }
            }
            return $mat;
        }

        /*
        * Matrix subtraction
        * other -> Matrix
        * returns -> Matrix
        */
        public function sub(Matrix $other)
        {
            if($this->nrow != $other->nrow || $this->ncol != $other->ncol)
                throw new MatrixException('Cannot subtract matrices: Matrices must have the SAME NUMBER of ROWS and COLUMNS');

            $mat = new Matrix($this->nrow, $this->ncol);
            for($i = 1; $i <= $this->nrow; $i++)
            {
                for($j = 1; $j <= $this->ncol; $j++)
                {
                    $mat->set($i, $j, $this->get($i, $j) - $other->get($i, $j));
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
?>