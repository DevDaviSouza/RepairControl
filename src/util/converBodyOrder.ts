export const convertBodyOrder = (body: any) => {
  return {
    customerId: body.customerId,
    dsModel: body.dsModel,
    dsColor: body.dsColor,
    dtYear: body.dtYear,
    dsPlate: body.dsPlate,
    qtdRepair: body.qtdRepair,
    qtdPainting: body.qtdPainting,
    dtOrder: body.dtOrder ? new Date(body.dtOrder) : undefined,
    dtCompletion: body.dtCompletion ? new Date(body.dtCompletion) : undefined,
    dsServices: body.dsServices,
    priorityId: body.priorityId,
    vlTotal: body.vlTotal,
    enterpriseId: body.enterpriseId
  }
}