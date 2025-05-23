import React, { ChangeEvent, useCallback, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery, useMutation } from '@apollo/client';
import StateDTO, { STATE } from '@/app/types/stateDTO';
import { ADD_STATE, UPDATE_STATE, GET_STATE } from '@/app/graphql/state';
import { COUNTRY_LOOKUP } from '@/app/graphql/Country';
import LookupDTO from '@/app/types/LookupDTO';

type ErrorMessageType = {
  state_name: string | null;
  country_id: string | null;
  state_code: string | null;
};

type StateType = {
  dtoState: StateDTO;
  arrCountryLookup: LookupDTO[];
  errorMessages: ErrorMessageType;
};

type Props = {
  dtoState: StateDTO;
  arrCountryLookup: LookupDTO[];
};

const useStateEntry = ({ dtoState, arrCountryLookup }: Props) => {
  const router = useRouter();
  const ERROR_MESSAGES: ErrorMessageType = Object.freeze({
    state_name: null,
    state_code: null,
    country_id: null
  } as ErrorMessageType);

  const INITIAL_STATE: StateType = Object.freeze({
    dtoState: dtoState,
    arrCountryLookup: arrCountryLookup,
    errorMessages: { ...ERROR_MESSAGES }
  } as StateType);

  const reducer = (state = INITIAL_STATE, action: StateType): StateType => {
    return { ...state, ...action };
  };

  const [state, setState] = useReducer(reducer, INITIAL_STATE);

  const [addState] = useMutation(ADD_STATE, {});

  const [updateState] = useMutation(UPDATE_STATE, {});

  const [getCountryLookup] = useLazyQuery(COUNTRY_LOOKUP, {
    fetchPolicy: 'network-only' // Doesn't check cache before making a network request
  });

  const [getState] = useLazyQuery(GET_STATE, {
    fetchPolicy: 'network-only' // Doesn't check cache before making a network request
  });

  const getData1 = useCallback(async (): Promise<void> => {
    let arrCountryLookup: LookupDTO[] = [];
    const { error, data } = await getCountryLookup();
    if (!error && data) {
      arrCountryLookup = data.getCountryLookup;
    }
    setState({ arrCountryLookup: arrCountryLookup } as StateType);
  }, [getCountryLookup]);

  const getData = useCallback(async (): Promise<void> => {
    let dtoState: StateDTO = STATE;
    const { error, data } = await getState({
      variables: {
        id: state.dtoState.id
      }
    });
    if (!error && data) {
      dtoState = { ...data.getState };
      dtoState.countryLookupDTO = { id: dtoState.country_id, text: dtoState.country_name };
    }
    setState({ dtoState: dtoState } as StateType);
  }, [getState, state.dtoState.id]);

  useEffect(() => {
    getData1();
    if (state.dtoState.id > 0) {
      getData();
    }
  }, [getData1, state.dtoState.id, getData]);

  const onInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setState({
        dtoState: {
          ...state.dtoState,
          [event.target.name]: event.target.value
        }
      } as StateType);
    },
    [state.dtoState]
  );

  const onCountryNameChange = useCallback(
    async (event: any, value: unknown) => {
      setState({
        dtoState: { ...state.dtoState, country_id: (value as LookupDTO).id, countryLookupDTO: value }
      } as StateType);
    },
    [state.dtoState]
  );

  const validateStateName = useCallback(async () => {
    if (state.dtoState.state_name.trim() === '') {
      return 'State Name is required';
    } else {
      return null;
    }
  }, [state.dtoState.state_name]);

  const onStateNameBlur = useCallback(async () => {
    const state_name = await validateStateName();
    setState({ errorMessages: { ...state.errorMessages, state_name: state_name } } as StateType);
  }, [validateStateName, state.errorMessages]);

  const validateCountryName = useCallback(async () => {
    if (state.dtoState.country_id === 0) {
      return 'Country Name is required';
    } else {
      return null;
    }
  }, [state.dtoState.country_id]);

  const onCountryNameBlur = useCallback(async () => {
    const country_id = await validateCountryName();
    setState({ errorMessages: { ...state.errorMessages, country_id: country_id } } as StateType);
  }, [validateCountryName, state.errorMessages]);

  const validateForm = useCallback(async () => {
    let isFormValid = true;
    const errorMessages: ErrorMessageType = {} as ErrorMessageType;
    errorMessages.state_name = await validateStateName();
    if (errorMessages.state_name) {
      isFormValid = false;
    }
    errorMessages.country_id = await validateCountryName();
    if (errorMessages.country_id) {
      isFormValid = false;
    }

    setState({ errorMessages: errorMessages } as StateType);
    return isFormValid;
  }, [validateStateName, validateCountryName]);

  const onSaveClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (await validateForm()) {
        if (state.dtoState.id === 0) {
          const { data } = await addState({
            variables: {
              ...state.dtoState
            }
          });
          if (data) {
            router.push('/states/list');
          }
        } else {
          const { data } = await updateState({
            variables: {
              ...state.dtoState
            }
          });
          if (data) {
            router.push('/states/list');
          }
        }
      }
    },
    [validateForm, addState, state.dtoState, router, updateState]
  );

  const onClearClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      setState({ dtoState: { ...STATE, id: state.dtoState.id }, errorMessages: { ...ERROR_MESSAGES } } as StateType);
    },
    [state.dtoState.id, ERROR_MESSAGES]
  );

  const onCancelClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      router.push('/states/list');
    },
    [router]
  );
  return {
    state,
    onInputChange,
    onCountryNameChange,
    onStateNameBlur,
    onCountryNameBlur,
    onSaveClick,
    onClearClick,
    onCancelClick
  };
};

export default useStateEntry;
