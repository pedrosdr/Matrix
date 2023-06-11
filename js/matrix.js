/**********************************************
 * Created by Pedro Sartori Dias dos Reis
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

    /*
    * Generates a Matrix using a number of rows and columns
    * rows and columns -> integer
    */
    constructor(rows, columns)
    {
        this._arr = Array()
        for(let i = 0; i < rows; i++) 
        {
            this._arr.push([])
            for (let j = 0; j < columns; j++) 
            {
                this._arr[i].push(0.0)
            }
        }

        this._nrow = rows
        this._ncol = columns
    }

    // factory methods

    /*
    * Generates a Matrix using an Array
    * arr -> Array
    * returns -> Matrix
    */
    static fromArray(arr)
    {
        let mat = new Matrix(arr.length, arr[0].length)
        for(let i = 0; i < mat._nrow; i++)
        {
            for(let j = 0; j < mat._ncol; j++)
            {
                mat.set(i+1, j+1, arr[i][j])
            }
        }

        return mat
    }

    /*
    * Generates an Identity Matrix
    * size -> integer
    * returns -> Matrix
    */
    static I(size)
    {
        let mat = new Matrix(size, size)
        for(let i = 1; i <= size; i++)
        {
            mat.set(i, i, 1)
        }
        return mat
    }

    // properties

    /*
    * Returns the number of rows
    * returns -> number
    */
    get numberOfRows()
    {
        return this._nrow
    }

    /*
    * Returns the number of columns
    * returns -> number
    */
    get numberOfColumns()
    {
        return this._nrow
    }

    // methods

    /*
    * Returns a new Matrix identical to te actual one
    * returns -> Matrix
    */
    copy()
    {
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i in this._arr)
        {
            for(let j in this._arr[i])
            {
                mat._arr[i][j] = this._arr[i][j]
            }
        }
        return mat
    }

    /*
    * Returns the value at row (i) and column (j)
    * i and j start at 1
    * i and j -> integer
    * returns -> number
    */
    get(i, j) 
    {
        return this._arr[i-1][j-1]
    }

    /*
    * Sets a value to row (i) and column (j)
    * i and j start at 1
    * i and j -> integer
    * value -> number
    * no return
    */
    set(i, j, value)
    {
        this._arr[i-1][j-1] = value
    }

    /*
    * Returns an Array containing the row of index i
    * i starts at 1
    * i -> integer
    * returns -> Array
    */
    getRow(i)
    {
        return this._arr[i-1]
    }

    /*
    * Sets a row at index i
    * i starts at 1
    * i -> integer
    * values -> Array
    * no return
    */
    setRow(i, values)
    {
        if(values.length !== this._ncol)
            throw new MatrixError('Invalid number of arguments, tried to add ' + values.length + ' arguments and the matrix row supports ' + this._ncol)
        
        this._arr[i-1] = values
    }

    /*
    * Returns an Array containing the columns of index j
    * j starts at 1
    * j -> integer
    * returns -> Array
    */
    getCol(j)
    {
        let col = Array()
        for(let row in this._arr)
            col.push(this._arr[row][j-1])
        return col
    }

    /*
    * Sets a row at index j
    * j starts at 1
    * j -> integer
    * values -> Array
    * no return
    */
    setCol(j, values)
    {
        if(values.length !== this._nrow)
            throw new MatrixError('Invalid number of arguments, tried to add ' + values.length + ' arguments and the matrix column supports ' + this._nrow)
        for(let row in this._arr)
        {
            this._arr[row][j-1] = values[row]
        }
    }

    /*
    * Returns the Minor matrix of row i and column j
    * i and j start at 1
    * i and j -> integer
    * returns -> Matrix
    */
    minor(i, j)
    {
        if(this._nrow == 1 || this._ncol == 1)
            throw new MatrixError('Error getting minor: Matrix must not have only 1 row or column')
        
        let mat = new Matrix(this._nrow - 1, this._ncol - 1)
        let rowIndex = 1
        for(let row in this._arr)
        {
            if(row == i - 1) continue
            let matRow = Array()
            for(let item in this._arr[row])
            {
                if(item == j - 1) continue
                matRow.push(this._arr[row][item])
            }
            mat.setRow(rowIndex, matRow)
            rowIndex += 1
        }
        return mat
    }

    /*
    * Returns the Determinant of the Minor matrix of row i and column j
    * i and j start at 1
    * i and j -> integer
    * returns -> number
    */
    D(i, j)
    {
        return this.minor(i, j).det()
    }

    /*
    * Returns the Cofactor of row i and column j
    * i and j start at 1
    * i and j -> integer
    * returns -> number
    */
    C(i, j)
    {
        return Math.pow(-1, i+j) * this.D(i, j)
    }

    /*
    * Returns the Determinant of the matrix
    * returns -> number
    */
    det()
    {
        if(this._ncol !== this._nrow)
            throw new MatrixError('Error computing determinant: Matrix must be square')

        let n = this._nrow

        if(n == 1)
            return this._arr[0][0]

        let sum = 0
        for(let j = 0; j < n; j++)
        {
            sum += this._arr[0][j] * this.C(1, j + 1)
        }
        return sum
    }

    /*
    * Returns the Transpose of the matrix
    * returns -> Matrix
    */
    T()
    {
        let mat = new Matrix(this._ncol, this._nrow)
        for(let i = 0; i < this._arr.length; i++)
        {
            for(let j = 0; j < this._arr[i].length; j++)
            {
                mat.set(j+1, i+1, this._arr[i][j])
            }
        }
        return mat
    }

    /*
    * Returns the Inverse of the matrix
    * returns -> Matrix
    */
    inv()
    {
        return this.matrixOfCofactors().T().mult_sc(1/this.det())
    }

    /*
    * Returns a new Matrix formed by the cofactors of the current Matrix
    * returns -> Matrix
    */
    matrixOfCofactors()
    {
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 0; i < this._arr.length; i++)
        {
            for(let j = 0; j < this._arr[i].length; j++)
            {
                mat.set(i+1, j+1, this.C(i+1, j+1))
            }
        }
        return mat
    }

    /*
    * Multiplies the matrix by a scalar
    * k -> number
    * returns -> Matrix
    */
    mult_sc(k)
    {
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 0; i < this._arr.length; i++)
        {
            for(let j = 0; j < this._arr[i].length; j++)
            {
                mat.set(i+1, j+1, this._arr[i][j] * k)
            }
        }
        return(mat)
    }
    
    /*
    * Divides the matrix by a scalar
    * k -> number
    * returns -> Matrix
    */
    div_sc(k)
    {
        return this.mult_sc(1/k)
    }

    /*
    * Scalar addition
    * k -> number
    * returns -> Matrix
    */
    add_sc(k)
    {
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 0; i < this._arr.length; i++)
        {
            for(let j = 0; j < this._arr[i].length; j++)
            {
                mat.set(i+1, j+1, this._arr[i][j] + k)
            }
        }
        return(mat)
    }

    /*
    * Scalar subtraction
    * k -> number
    * returns -> Matrix
    */
    sub_sc(k)
    {
        return this.sum_sc(-k)
    }

    /*
    * Applies a transformation on the items of the matrix
    * callback -> function [must take number as argument and return number]
    * returns -> Matrix
    */
    apply(callback)
    {
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 1; i <= mat._arr.length; i++)
        {
            for(let j = 1; j <= mat._arr[i-1].length; j++)
            {
                mat.set(i, j, callback(this.get(i, j)))
            }
        }
        return mat
    }

    /*
    * Multiplies the matrix by other matrix
    * other -> Matrix
    * returns -> Matrix
    */
    mult(other)
    {
        if(this._ncol != other._nrow)
            throw new MatrixError('Cannot multiply matrices: NUMBER OF COLUMNS of the first is DIFFERENT from the NUMBER OF ROWS of the second')

        let mat = new Matrix(this._nrow, other._ncol)

        for(let i = 1; i <= this._nrow; i++)
        {
            for(let j = 1; j <= other._ncol ; j++)
            {
                let a = 0
                for(let k = 1; k <= other._nrow; k++)
                {
                    a += this.get(i, k) * other.get(k, j)
                }

                mat.set(i, j, a)
            }
        }

        return mat
    }

    /*
    * Divides the matrix by other matrix
    * other -> Matrix
    * returns -> Matrix
    */
    div(other)
    {
        return this.mult(other.inv())
    }

    /*
    * Matrix addition
    * other -> Matrix
    * returns -> Matrix
    */
    add(other)
    {
        if(this._nrow != other._nrow || this._ncol != other._ncol)
            throw new MatrixError('Cannot sum matrices: Matrices must have the SAME NUMBER of ROWS and COLUMNS')
        
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 1; i <= this._nrow; i++)
        {
            for(let j = 1; j <= this._ncol ; j++)
            {
                mat.set(i, j, this.get(i, j) + other.get(i, j))
            }
        }
        return mat
    }

    /*
    * Matrix subtraction
    * other -> Matrix
    * returns -> Matrix
    */
    sub(other)
    {
        if(this._nrow != other._nrow || this._ncol != other._ncol)
            throw new MatrixError('Cannot subtract matrices: Matrices must have the SAME NUMBER of ROWS and COLUMNS')
        
        let mat = new Matrix(this._nrow, this._ncol)
        for(let i = 1; i <= this._nrow; i++)
        {
            for(let j = 1; j <= this._ncol ; j++)
            {
                mat.set(i, j, this.get(i, j) - other.get(i, j))
            }
        }
        return mat
    }
}

class MatrixError extends Error 
{
    constructor(message) 
    {
        super(message)
        this.name = 'MatrixError'
    }
}