class Matrix 
{
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

    get(i, j) 
    {
        return this._arr[i-1][j-1]
    }

    set(i, j, value)
    {
        this._arr[i-1][j-1] = value
    }

    getRow(i)
    {
        return this._arr[i-1]
    }

    setRow(i, values)
    {
        if(values.length !== this._ncol)
            throw new MatrixError('Invalid number of arguments, tried to add ' + values.length + ' arguments and the matrix row supports ' + this._ncol)
        
        this._arr[i-1] = values
    }

    getCol(j)
    {
        let col = Array()
        for(let row in this._arr)
            col.push(this._arr[row][j-1])
        return col
    }

    setCol(j, values)
    {
        if(values.length !== this._nrow)
            throw new MatrixError('Invalid number of arguments, tried to add ' + values.length + ' arguments and the matrix column supports ' + this._nrow)
        for(let row in this._arr)
        {
            this._arr[row][j-1] = values[row]
        }
    }

    minor(i, j)
    {
        if(this._ncol !== this._nrow)
            throw new MatrixError('Error geting D: Matrix must be square')

        let n = this._nrow
        let d = new Matrix(n-1, n-1)
        let rowIndex = 1
        for(let row in this._arr)
        {
            if(row == i - 1) continue
            let dRow = Array()
            for(let item in this._arr[row])
            {
                if(item == j - 1) continue
                dRow.push(this._arr[row][item])
            }
            d.setRow(rowIndex, dRow)
            rowIndex += 1
        }
        return d
    }

    D(i, j)
    {
        return this.minor(i, j).det()
    }

    C(i, j)
    {
        return Math.pow(-1, i+j) * this.D(i, j)
    }

    det()
    {
        if(this._ncol !== this._nrow)
            throw new MatrixError('Error computing determinant: Matrix must be square')

        let n = this._nrow

        if(n == 1)
            return this._arr[0][0]

        let sum = 0
        for(let j = 0; j < this._arr[0].length; j++)
        {
            sum += this._arr[0][j] * this.C(1, j + 1)
        }
        return sum
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

// let mat = new Matrix(4, 4)

// mat.setRow(1, [1, 2, 3, 4])
// mat.setRow(2, [4, 5, 6, 3])
// mat.setRow(3, [7, 8, 3, 2])
// mat.setRow(4, [1, 2, 3, 1])

// mat.setRow(1, [1, 2, 3, 4, 2])
// mat.setRow(2, [4, 5, 6, 3, 3])
// mat.setRow(3, [7, 8, 3, 2, 6])
// mat.setRow(4, [1, 2, 3, 1, 1])
// mat.setRow(5, [4, 5, 6, 1, 5])


let mat = Matrix.fromArray([[3, 4, 5],
                            [1, 2, 3],
                            [3, 4, 4]])
console.log(mat)