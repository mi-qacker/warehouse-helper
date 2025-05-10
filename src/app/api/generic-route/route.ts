import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {ApiRequest, ApiResponse} from '.';
export async function POST(request: Request) {
  const {cells, inputPoint, outputPoint}: ApiRequest = await request.json();
  const {route, distance} = await solveOptimizationRoute(
    cells,
    inputPoint,
    outputPoint
  );
  const res: ApiResponse = {route, distance};
  return Response.json(res);
}
