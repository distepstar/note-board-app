import React, { memo, useCallback, useEffect, useState } from "react";
// react Dnd
import { useDrag, useDrop } from "react-dnd";
import { Identifier } from "dnd-core";
// font awesome
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
// const
import { TKanbanData, IKanbanData, sectionListInit } from "../../constants/Kanban";
// react router dom
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
// react query
import { useMutation, useQuery } from "react-query";
// react datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// APIs
import KanbanApi from "../../apis/Kanban";
import { AxiosResponse } from "axios";
import { IResponse } from "../../constants/apis";

interface IKanbanSection {
  accept: TKanbanData[];
  titleType: TKanbanData;
  data: IKanbanData[] | null;
  handleOnDrop: (item: any) => void;
}


export const KanbanSection: React.FC<IKanbanSection> = ({ accept, titleType, data, handleOnDrop }): JSX.Element => {
  const noteItemKey = `kanban-${titleType.trim().toLowerCase}-item`;
  const [dataList, setDataList] = useState<IKanbanData[] | null>(data);

  useEffect(() => {
    updateDataList(data);
  }, [data])

  const updateDataList = useCallback((dataItem: IKanbanData[] | null) => {
    setDataList(dataItem);
  }, [data])

  const [{ isOver }, drop] = useDrop({
    accept,
    drop: handleOnDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  })

  return (
    <div className="kanban-section-wrapper w-3/12 h-[60rem] rounded-md bg-gray-400 pb-4 text-black">
      {/* popup outlet */}
      <Outlet />
      <div className="flex flex-col justify-start place-items-center">
        <div className="kanban-section-title-wrapper flex flex-row justify-start place-items-center place-self-start">
          <h1 className="font-bold text-xl text-slate-700 p-4">{titleType}</h1>
          <div className="text-lg text-gray-800">{data ? data.length : 0}</div>
        </div>
        <div className={`kanban-section-items-wrapper overflow-y-scroll no-scrollbar w-full h-[55rem] snap-y ${isOver ? 'bg-gray-500' : ''}`} ref={drop}>
          <div className="flex flex-col justify-start place-items-center space-y-6" >
            {dataList && dataList.map((e, idx) => {
              return (
                <KanbanNoteItem
                  key={`${noteItemKey}-${idx}`}
                  data={e}
                  accept={accept}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface IKanbanManageButton {
  icon: IconDefinition;
  title: string;
  onClickEvent?: (e: React.MouseEvent) => void;
  customClass?: string;
  children?: JSX.Element;
}

export const KanbanManageButton: React.FC<IKanbanManageButton> = ({ icon, title, onClickEvent, customClass, children }): JSX.Element => {
  return (
    <div className="kanban-manage-button-wrapper flex flex-col justify-center place-items-center h-8">
      <button className={`flex flex-row space-x-2 w-full h-full justify-center place-items-center pl-4 pr-4 ${customClass}`} onClick={onClickEvent}>
        <FontAwesomeIcon icon={icon} />
        <span>{title}</span>
      </button>
      {children}
    </div>
  )
}

interface IKanbanNoteItem {
  data: IKanbanData;
  icon?: IconDefinition;
  accept: TKanbanData[];
}

export const KanbanNoteItem: React.FC<IKanbanNoteItem> = memo(({ data, icon = faUser, accept }): JSX.Element => {

  // react dnd
  const [{ isDragging, opacity }, drag] = useDrag(() => ({
    type: data.section,
    item: { itemIndex: data._id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
      isDragging: monitor.isDragging(),
    })
  }), [data]);


  const [{ handlerId }, drop] = useDrop<IKanbanNoteItem, void, { handlerId: Identifier | null }>({
    accept,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: IKanbanNoteItem, monitor) => ({
    })
  });

  return (
    <Link className="kanban-section-item-wrapper flex flex-col space-y-4 justify-between place-items-center w-11/12 h-[12rem] bg-white rounded-md snap-start cursor-pointer" ref={drag} style={{ opacity }} to={`view/${data._id}`} relative="path">
      {/* {isDropped ? <s>Dropped</s> : "Dropped"} */}
      <div className="kanban-section-item-desc p-4 place-self-start justify-self-end text-left line-clamp-4 overflow-ellipsis w-10/12">
        {data.title}
      </div>
      <div className="kanban-section-item-user flex flex-row place-items-center space-x-4 p-4 place-self-end text-lg">
        <div>{data.creator}</div>
        <div className="rounded-full  bg-gray-400 w-8 h-8 flex justify-center place-items-center text-xl">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </Link>
  )
});

interface IKanbanItemTest {

}

type TCancelAction = 'cancel' | 'discard';

export const KanbanItemTest: React.FC<IKanbanItemTest> = () => {
  // react router hooks
  // catching path id
  let { id } = useParams();
  const navi = useNavigate();

  // states
  const [kanbanData, setKanbanData] = useState<IKanbanData | null>(null);
  const [isEditDisabled, setIsEditDisabled] = useState<boolean>(true);
  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  // api calls
  // fetch kanban data by its Id
  const { isLoading, data, error, isFetching } = useQuery<IKanbanData, Error>('kanbanDataById', async () => {
    if (id) {
      return await KanbanApi.findKanbanDataById(id);
    } else {
      throw new Error(`According kanban data with id: '${id}' not found!`);
    }
  }, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setKanbanData(data as IKanbanData);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // update api
  const mutation = useMutation(KanbanApi.updateKanbanDataById, {
    onSuccess: (res: AxiosResponse<IResponse>) => {
      // alert popup for update success
      alert(res.data.message);
      // navigate back to the kanbanboard
      navi("..");
    },
    onError: (err: any) => {
      console.error(err);
    },
  })

  useEffect(() => {
    // check if there are any changes
    checkDataChange();
  }, [kanbanData]);

  // effect
  useEffect(() => {
    if (!isLoading) {
      // disable parent scroll action when pop-up
      document.body.style.overflow = "hidden";
    }

    // clear effect
    return (() => {
      // enable parent scroll on destroy
      document.body.style.overflow = "scroll";
    })
  }, [isLoading, data])

  // api methods
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    mutation.mutate(kanbanData as IKanbanData);
  }

  // methods
  // handle focus state when interacting with user input
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  // handle edit enable
  const enableEdit = () => {
    setIsEditDisabled(false);
  }

  const checkDataChange = () => {
    if (JSON.stringify(data) !== JSON.stringify(kanbanData)) {
      setIsDataChanged(true);
    } else {
      setIsDataChanged(false);
    }
  }
  // handle cancel popup windows and navigate back to parent route

  const handleCancel = (action: TCancelAction, e: React.MouseEvent) => {
    e.preventDefault();
    let allowEscape = true;

    if (isDataChanged) {
      const confirm = window.confirm("Are you sure you want to discard changes?");
      allowEscape = confirm;
      allowEscape && setKanbanData(data as IKanbanData);
    }

    if (allowEscape && !focused) {
      if (action === 'cancel') {
        navi("..");
      } else if (action === 'discard') {
        setIsEditDisabled(true);
      }
    }
  }

  const handleInputFieldChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (kanbanData?.hasOwnProperty(fieldName)) {
      setKanbanData({ ...kanbanData, [fieldName]: e.target.value });
    } else {
      console.error(`Field: ${fieldName} not found inside kanban data!`);
    }
  }

  const handleSectionChange = (section: TKanbanData, e: React.MouseEvent) => {
    e.preventDefault();
    setKanbanData({ ...kanbanData, section: section } as IKanbanData);
  }

  // formate date to mm-dd-yyyy
  const formateDate = (date: Date | undefined) => {
    if (date) {
      const dateTemp = new Date(date);
      let formatedDate = `${dateTemp.getMonth() + 1}/${dateTemp.getDate()}/${dateTemp.getFullYear()}`;
      return formatedDate;
    } else {
      return "N/A";
    }
  }
  const handleDueDate = (date: Date | undefined) => {
    let dateTemp = date ? new Date(date) : new Date();
    return dateTemp;
  }
  // handle user select event
  const handleDateOnChange = (name: "issuedDate" | "dueDate", date: Date | null, e: React.SyntheticEvent<any, Event> | undefined) => {
    e?.preventDefault();
    if (!isEditDisabled && date !== null) {
      setKanbanData({ ...kanbanData, [name]: date } as IKanbanData);
    } else {
      console.error("Error occur when assigning date to the original data!");
    }
  }

  // handle error
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 w-full h-full overflow-y-hidden `} >
      <div className="flex flex-col justify-center place-items-center w-full h-full bg-black/30" onClick={e => handleCancel('cancel', e)}>
        <div className="w-[55rem] h-[55rem] justify-start place-items-start bg-white rounded-md p-4 overflow-y-scroll no-scrollbar" onClick={e => e.stopPropagation()}>
          {
            isLoading || isFetching ?
              <div className="w-full h-full flex justify-center place-items-center">
                <svg className="w-12 h-12 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round"></path>
                  <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round"></path>
                  <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round"></path>
                  <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round"></path>
                  <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              :
              <div className="flex flex-col w-full h-full space-y-4" >
                <div className="inline-flex flex-row w-full justify-between place-items-center">
                  <div>
                    <h1 className="text-2xl font-bold">{kanbanData?.title}</h1>
                    <div className="text-gray-500 text-sm">Issued by: {kanbanData?.creator} </div>
                    <div className="text-gray-500 text-sm">Issued Date: {formateDate(kanbanData?.issuedDate)}</div>
                    <div className="text-gray-500 text-sm">Assigned to: {kanbanData?.assignedTo ? kanbanData.assignedTo : "N/A"}</div>
                  </div>
                  <div className="flex flex-col space-y-2 justify-start place-items-end">
                    <button className="text-2xl" onClick={e => handleCancel('cancel', e)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <div className="flex flex-row space-x-2 text-lg">
                      <div className=" font-bold">ID:</div>
                      <div className="underline">{kanbanData?._id}</div>
                    </div>
                  </div>
                </div>
                {
                  !isEditDisabled &&
                  <div className="flex flex-row space-x-4">
                    <div className="block w-6/12">
                      <div className="text-xl font-bold">Title:</div>
                      <div className="flex flex-row flex-wrap gap-2 justify-start place-items-start rounded-md bg-black/70 p-5 w-full text-black">
                        <input
                          className="w-full rounded-md p-2"
                          type="text"
                          value={kanbanData?.title}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={(e) => handleInputFieldChange('title', e)} />
                      </div>
                    </div>
                    <div className="block w-6/12">
                      <div className="text-xl font-bold">Status:</div>
                      <div className="flex flex-row flex-wrap gap-2 justify-start place-items-start rounded-md bg-black/70 p-5 text-white">
                        {
                          isEditDisabled ?
                            <div className={`flex justify-center place-items-center rounded-md h-10 text-lg p-4 bg-blue-500 `}>{kanbanData?.section}</div>
                            :
                            sectionListInit.map(ele => {
                              return (
                                <button
                                  key={`section-items-${ele.id}`}
                                  className={`flex justify-center place-items-center rounded-md h-10 text-lg p-4 ${ele.titleType === kanbanData?.section ? ' bg-blue-500' : ' bg-blue-400'}`}
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onClick={(e) => handleSectionChange(ele.titleType, e)}
                                >
                                  {ele.titleType}
                                </button>
                              )
                            })
                        }
                      </div>
                    </div>
                  </div>
                }

                {
                  !isEditDisabled &&
                  <div className="flex flex-row space-x-4">
                    <div className="block w-6/12">
                      <div className="text-xl font-bold">Creator:</div>
                      <div className="flex flex-row flex-wrap gap-2 justify-start place-items-start rounded-md bg-black/70 p-5 w-full text-black">
                        <input
                          className="w-full rounded-md p-2"
                          type="text"
                          value={kanbanData?.creator}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={(e) => handleInputFieldChange('creator', e)} />
                      </div>
                    </div>
                    <div className="block w-6/12">
                      <div className="text-xl font-bold">Assigend To:</div>
                      <div className="flex flex-row flex-wrap gap-2 justify-start place-items-start rounded-md bg-black/70 p-5 w-full text-black">
                        <input
                          className="w-full rounded-md p-2"
                          type="text"
                          value={kanbanData?.assignedTo}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={(e) => handleInputFieldChange('assignedTo', e)} />
                      </div>
                    </div>
                  </div>
                }

                <div className="flex flex-row space-x-4">
                  <div className="block w-6/12">
                    <div className="text-xl font-bold">Issued Date:</div>
                    <div className="flex flex-col space-y-2 justify-center place-items-start rounded-md bg-black/70 p-5">
                      <DatePicker
                        className="text-lg p-4 text-black rounded-md w-60 h-10 disable"
                        selected={handleDueDate(kanbanData?.issuedDate)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(date, e) => handleDateOnChange('issuedDate', date, e)}
                        disabled={isEditDisabled}
                      />
                    </div>
                  </div>
                  <div className="block w-6/12">
                    <div className="text-xl font-bold">Due Date:</div>
                    <div className="flex flex-col space-y-2 justify-center place-items-start rounded-md bg-black/70 p-5">
                      <DatePicker
                        className="text-lg p-4 text-black rounded-md w-60 h-10 disable"
                        selected={handleDueDate(kanbanData?.dueDate)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(date, e) => handleDateOnChange('dueDate', date, e)}
                        disabled={isEditDisabled}
                      />
                    </div>
                  </div>
                </div>
                <div className="block w-full">
                  <div className="text-xl font-bold">Description:</div>
                  <div className="flex flex-col space-y-2 justify-center place-items-start rounded-md bg-black/70 p-5 text-white">
                    <textarea
                      className="w-full rounded-md text-black overflow-y-scroll p-4"
                      value={kanbanData?.desc}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e) => handleInputFieldChange('desc', e)}
                      rows={6}
                      disabled={isEditDisabled}
                    />
                  </div>
                </div>
                <div className="block w-full">
                  <div className="text-xl font-bold">Comment:</div>
                  <div className="flex flex-col space-y-2 justify-center place-items-start rounded-md bg-black/70 p-5 text-white">
                    <textarea
                      className="w-full rounded-md text-black overflow-y-scroll p-4"
                      value={kanbanData?.comment}
                      rows={6}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={(e) => handleInputFieldChange('comment', e)}
                      disabled={isEditDisabled}
                    />

                  </div>
                </div>
                <div className="w-full pb-4">
                  {
                    isEditDisabled ?
                      <div className="flex flex-row space-x-4 justify-self-end justify-end place-items-end">
                        <button className="rounded-md pl-4 pr-4 w-22 h-10 bg-blue-600 text-white hover:bg-blue-400" onClick={enableEdit}>Edit</button>
                        <button className="rounded-md pl-4 pr-4 w-22 h-10 bg-red-600 text-white hover:bg-red-400" onClick={e => handleCancel('cancel', e)}>Cancel</button>
                      </div>
                      :
                      <div className="flex flex-row space-x-4 justify-self-end justify-end place-items-end">
                        {mutation.isLoading}
                        <button className={`rounded-md pl-4 pr-4 w-22 h-10 bg-blue-600 text-white ${isDataChanged ? 'hover:bg-blue-400' : 'bg-gray-700'}`} disabled={!isDataChanged} onClick={handleSave}>Save</button>
                        <button className="rounded-md pl-4 pr-4 w-22 h-10 bg-yellow-800 text-white hover:bg-yellow-600" onClick={e => handleCancel('discard', e)}>Discard</button>
                        <button className="rounded-md pl-4 pr-4 w-22 h-10 bg-red-600 text-white hover:bg-red-400" onClick={e => handleCancel('cancel', e)}>Cancel</button>
                      </div>
                  }
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}