class Matrix 
{
    constructor(rows, columns, matrix)
    {
        this._arr = Array()
        if(matrix == null)
        {
            for(let i = 0; i < rows; i++) 
            {
                this._arr.push([])
                for (let j = 0; j < columns; j++) 
                {
                    this._arr[i].push(0.0)
                }
            }
        }
        else 
        {
            for(let row in matrix) 
            {
                this._arr.push(Array())
                for(let item in matrix[row])
                {
                    this._arr[row][item] = matrix[row][item]
                }
            }
        }

        this._nrow = rows
        this._ncol = columns
    }

    get() 
    {
        throw new MatrixError('Not implemented yet')
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

src = [[3, 4, 5],
       [7, 7, 3]]

mat = new Matrix(src)
mat.get()
