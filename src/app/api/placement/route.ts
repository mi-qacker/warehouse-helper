import {ApiRequest, ApiResponse} from '.';
import {solveOptimizationPlacement} from '@/modules/lp-solver';

export async function POST(request: Request) {
  const {products, cells, startPosition, distanceMatrix}: ApiRequest =
    await request.json();

  const newPlacement = await solveOptimizationPlacement(
    products,
    cells,
    startPosition,
    distanceMatrix
  );
  const res: ApiResponse = {placement: newPlacement};
  return Response.json(res);
}
