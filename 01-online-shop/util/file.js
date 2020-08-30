const fs = require('fs')

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Failed to delete: ${filePath}`)
      console.log(err)
    }
    console.log(`Deleted: ${filePath}`)
  })
}

exports.deleteFile = deleteFile
