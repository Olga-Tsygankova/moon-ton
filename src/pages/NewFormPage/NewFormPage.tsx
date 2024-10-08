import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Footer, Header } from '../MainPage';
import { SubmitButton } from '../../ui';
import { sendFile, sendMessage } from '../../api/telegram';
import { FormBody } from './FormBody';
import type { IContactForm } from './models';
import { prepareMessage } from './utils';
import { contactInfoSchema } from './constants';

import './NewFormPage.css';
import { TwitterIcon } from '../../ui/svg/TwitterIcon';
import { TelegramIcon } from '../../ui/svg/TelegramIcon';

export const NewFormPage = () => {
  const methods = useForm<IContactForm>({
    resolver: yupResolver(contactInfoSchema),
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formFiles, setFormFiles] = useState<FileList | null>(null);

  const handleSetUploadFile = useCallback((data: FileList) => {
    // TODO сделать проверку размера файла
    setFormFiles(data);
  }, []);

  const handleSubmit = useMemo(
    () =>
      methods.handleSubmit(async (data) => {
        const message = prepareMessage(data, Boolean(formFiles?.length));
        setIsFetching(true);

        // Нет файла - отправляем сообщение
        if (!formFiles?.length) {
          const result = await sendMessage(message);
          if (result.status === 200) setIsSuccess(true);
          // Есть файл - отправляем файл с caption
        } else if (formFiles && message.length <= 1024) {
          const result = await sendFile(formFiles[0], message);
          if (result.status === 200) setIsSuccess(true);
          // Длинный текст - отправляем и файл и сообщение
        } else if (formFiles && message.length <= 4096) {
          const resultMessage = await sendMessage(message);
          const resultFile = await sendFile(formFiles[0], data.projectName); // TODO
          if (resultMessage.status === 200 && resultFile.status === 200)
            setIsSuccess(true);
        } // TODO больше 4000 быть не должно, но может, если символы не латинские
        // это единственная обработка ошибки - даем отправить повторно
        // TODO добавить сообщение об ошибке
        setIsFetching(false);
      }),
    [methods, formFiles],
  );

  return (
    <div className="new-form-page">
      <Header isMainPage={false} />
      {!isSuccess && (
        <div className="form-all-container">
          <FormBody
            methods={methods}
            onUploadFile={handleSetUploadFile}
            attachedFiles={formFiles}
          />
          <div className='submit-container'>
            <SubmitButton
              onClick={handleSubmit}
              disabled={isFetching}
            >
              Submit
            </SubmitButton>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="form-successful-container">
          <div className="form-successful-title">
            <div className="form-successful-title-lite">
              We will contact you
            </div>
            <div className="form-successful-title-bold">shortly!</div>
          </div>
          <div className="form-successful-link">
            <a href="https://x.com/MoonTON_bridge">
              <TwitterIcon />
              Our twitter
            </a>
            <a href="https://t.me/moonton_bridge">
              {' '}
              <TelegramIcon />
              Our TG portal
            </a>
            <a href="#">
              {' '}
              <TelegramIcon /> TG CEO
            </a>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
