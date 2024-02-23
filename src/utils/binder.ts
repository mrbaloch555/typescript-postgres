type ControllerMethod = (
  req: Request,
  res: Response,
  next: NewableFunction
) => Promise<void>;

export function bindControllerMethods(controller: any): any {
  const boundController: any = {};

  // Loop through each property of the controller
  for (const key of Object.getOwnPropertyNames(
    Object.getPrototypeOf(controller)
  )) {
    const method: ControllerMethod = controller[key];

    // If the property is a function, bind it to the original controller instance
    if (typeof method === "function") {
      boundController[key] = method.bind(controller);
    }
  }

  return boundController;
}
