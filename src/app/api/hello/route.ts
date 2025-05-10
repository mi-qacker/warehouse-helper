import {GLPK} from 'glpk.js';

let glpk: GLPK;

async function loadGLPK() {
  if (!glpk) {
    const GLPK = (await import('glpk.js')).default;
    glpk = GLPK();
  }
  return glpk;
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const glpk = loadGLPK();

  return Response.json({message: 'Hello World!'});
}
