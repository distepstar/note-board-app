export interface ISessionStorageState {
  data?: any;
  success: boolean;
  error?: Error;
}

export const saveStateToSessionStorage = (stateName: string, data: any) => {
  try {
    const seralizedData = JSON.stringify(data);
    // console.log(`save seralized data: ${seralizedData}`);
    sessionStorage.setItem(stateName, seralizedData);
  }
  catch (err) {
    console.error(err);
  }
}

export const loadStateFromSessionStorage = (stateName: string): ISessionStorageState => {
  try {
    let success = false;
    const seralizedData = sessionStorage.getItem(stateName);
    // console.log(`get seralized data: ${seralizedData}`);
    success = seralizedData ? true : success;

    return { data: seralizedData, success: success };
  }
  catch (err) {
    console.error(err);
    return { success: false, error: err as Error };
  }
}
