// Instead of using
// const express = require('express')
// TypeScript allow the following import notation - which is prefered
// as code autocompletion in .ts file will work
import express from 'express'

const app = express()

app.listen(3000)
