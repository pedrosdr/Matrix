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
}

class MatrixError extends Error 
{
    constructor(message) 
    {
        super(message)
        this.name = 'MatrixError'
    }
}

let mat = new Matrix(5, 4)

mat.setRow(1, [1, 2, 3, 0])
mat.setRow(2, [4, 5, 6, 0])
mat.setRow(3, [7, 8, 9, 0])
mat.setRow(4, [1, 2, 3, 0])
mat.setRow(5, [4, 5, 6, 0])
mat.setCol(4, [4, 7, 1, 4, 7])
console.log(mat)


