import {
	GOOGLE_COM,
	BING_COM
} from '../constants/translateSource';
import google from '../public/translate/google';
import bing from '../public/translate/bing';
import { SOURCE_ERROR } from '../constants/errorCodes';
import { AudioResponse, DetectResponse, TranslateResponse } from './send';
import { getError } from './translate/utils';

type TranslateRequestParams = {
	source: string;
	text: string;
	from: string;
	to: string;
	com: boolean;
	preferredLanguage: string;
	secondPreferredLanguage: string;
};

export const translate = async ({ source, ...requestParams }: TranslateRequestParams): Promise<TranslateResponse> => {
	let translate;

	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			break;
		default:
			return { code: SOURCE_ERROR };
	}
	
	try {
		const translation = await translate(requestParams);

		return { translation };
	}
	catch (err) {
		return { code: (err as ReturnType<typeof getError>).code };
	}
};

type AudioRequestParams = {
	source: string;
	text: string;
	from: string;
	com: boolean;
};

export const audio = async (requestParams: AudioRequestParams): Promise<AudioResponse> => {
	let audio;
	switch (requestParams.source) {
		case GOOGLE_COM:
			audio = google.audio;
			break;
		case BING_COM:
			audio = bing.audio;
			break;
		default:
			audio = google.audio;
			break;
	}

	try {
		const dataUri = await audio(requestParams);
		
		return { dataUri };
	}
	catch (err) {
		return { code: (err as ReturnType<typeof getError>).code };
	}
};

type DetectRequestParams = {
	source: string;
	text: string;
	com: boolean;
};

export const detect = async (requestParams: DetectRequestParams): Promise<DetectResponse> => {
	let detect;
	switch (requestParams.source) {
		case GOOGLE_COM:
			detect = google.detect;
			break;
		case BING_COM:
			detect = bing.detect;
			break;
		default:
			detect = google.detect;
			break;
	}

	try {
		let langCode = await detect(requestParams);

		return { langCode };
	}
	catch (err) {
		return { code: (err as ReturnType<typeof getError>).code };
	}
};
