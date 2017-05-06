import { Injectable } from '@angular/core';

/**
 * Use this file as a template of available config properties
 *
 * Do not put here your local configuration!!!
 * only the default config values
 */

@Injectable()
export class LocalConfig {

  serverBaseUrl: string = 'http://swapi.co/api/';

  constructor() {}
}
