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

    D(i, j)
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
}

class MatrixError extends Error 
{
    constructor(message) 
    {
        super(message)
        this.name = 'MatrixError'
    }
}

// let mat = new Matrix(5, 5)

// mat.setRow(1, [1, 2, 3, 4, 0])
// mat.setRow(2, [4, 5, 6, 3, 0])
// mat.setRow(3, [7, 8, 9, 2, 0])
// mat.setRow(4, [1, 2, 3, 1, 0])
// mat.setRow(5, [4, 5, 6, 1, 0])
// mat.setCol(5, [4, 7, 1, 4, 7])
// console.log(mat.D(1, 2))

let mat = new Matrix(3, 3)
mat.setRow(1, [2, 3, 1])
mat.setRow(2, [1, 1, 5])
mat.setRow(3, [4, 9, 7])
console.log(mat)

console.log(mat.D(2, 2))


