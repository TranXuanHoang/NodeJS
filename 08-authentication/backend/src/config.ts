// NOTE: In the real-world application, we should never
// track and commit this file to public Git repos (like Github).
// We should ignore this file by specifying it in the .gitignore file.
// Here, however, the file is tracked with Git as this is an
// example project.
/** Hold application secrets and config */
export const config = {
  /** Secret key for generating JSON Web Tokens. */
  jwt_secret_key: 'A random secret string used for generating JSON Web Tokens'
}
