import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IAPIResponse } from 'src/typings';
import { Hash } from './hash.utils';
import { JwtService } from './jwt.utils';
import { APIResponse } from './responses.utils';

describe('Utility Module', () => {
  let moduleReference: TestingModule;

  let apiResponseProvider: APIResponse;
  let hashProvider: Hash;
  let jwtProvider: JwtService;

  beforeAll(async () => {
    moduleReference = await Test.createTestingModule({
      providers: [
        APIResponse,
        Hash,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((value: string) => {
              if (value === 'SECRET_KEY') {
                return 'secretKey';
              }
            }),
          },
        },
      ],
      imports: [ConfigModule],
    }).compile();

    apiResponseProvider = moduleReference.get<APIResponse>(APIResponse);
    hashProvider = moduleReference.get<Hash>(Hash);
    jwtProvider = moduleReference.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await moduleReference.close();
  });
  describe('API Response Utility', () => {
    test('Success response returns correct structure', async () => {
      const response: IAPIResponse = await apiResponseProvider.success(
        'success',
        {
          name: 'Microservices',
        },
      );

      expect(response.status).toBeTruthy();
      expect(response.message).toEqual('success');
      expect(response.data.name).toEqual('Microservices');
    });

    test('Error response returns correct structure', async () => {
      const response: IAPIResponse = await apiResponseProvider.error('failure');

      expect(response.status).toBeFalsy();
      expect(response.message).toEqual('failure');
      expect(response.data).not.toBeDefined();
    });
  });

  describe('Hash Utility', () => {
    test('hashes a plain text', async () => {
      const hashedValue = await hashProvider.make('artisans_text');

      expect(hashedValue).not.toEqual('artisans_text');
    });
    test('comparing a plain text and hashed value is valid', async () => {
      const hashedValue = await hashProvider.make('artisans_text');

      const matched = await hashProvider.verify('artisans_text', hashedValue);

      expect(matched).toBeTruthy();
    });
  });

  describe('Jwt Utility', () => {
    test("returns token that doesn't expire given valid payload", async () => {
      const token = await jwtProvider.generateAccessToken({
        email: 'test@outlook.com',
        uuid: '089h-ugbuiuh',
      });

      expect(token).toBeDefined();
    });
  });
});
