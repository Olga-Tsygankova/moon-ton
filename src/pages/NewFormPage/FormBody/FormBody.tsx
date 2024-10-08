import type { UseFormReturn } from 'react-hook-form';

import {
  Form,
  FormRadioGroup,
  FormTextArea,
  FormTextInput,
} from '../../../components';
import { FormBlock } from '../FormBlock';
import { UploadAsset } from '../UploadAsset';
import type { IContactForm } from '../models';
import { requiredFields } from '../constants';

import './FormBody.css';

const chainOptions = [
  { value: 'Ethereum', label: 'Ethereum' },
  { value: 'Solana', label: 'Solana' },
  { value: 'TON', label: 'TON' },
];

type FormBodyProps = {
  methods: UseFormReturn<IContactForm>;
  onUploadFile: (data: FileList) => void;
  attachedFiles: FileList | null;
};

export const FormBody = ({
  methods,
  onUploadFile,
  attachedFiles,
}: FormBodyProps) => {
  return (
    <Form methods={methods}>
      <FormBlock title="About Project">
        <div className="form-body-project-info-flex">
          <FormTextInput
            fieldName="projectName"
            title="Project Name*"
            placeholder="Name"
          />
          <FormTextInput
            fieldName="tokenSymbol"
            title="Token Symbol or Ticker*"
            placeholder="$MOON"
          />
        </div>
        <FormTextArea
          fieldName="projectDescription"
          title="Project Description"
          placeholder="Describe your project"
        />
      </FormBlock>
      <FormBlock title="Contact" watchFieldNames={requiredFields.aboutProject}>
        <FormTextInput
          fieldName="name"
          title="Name*"
          placeholder="Name"
        />
        <FormTextInput
          fieldName="email"
          title="Email"
          placeholder="email@gmail.com"
        />
        <FormTextInput
          fieldName="telegramLink"
          title="Telegram Link*"
          placeholder="@username"
        />
      </FormBlock>
      <FormBlock title="Project Link" watchFieldNames={requiredFields.contact}>
        <FormTextInput
          fieldName="projectTwitterLink"
          title="Project Twitter Link*"
          placeholder="https:// twitter.com/moonton"
        />
        <FormTextInput
          fieldName="projectTelegramLink"
          title="Project Telegram Link*"
          placeholder="https://t.me/moonton"
        />
        <FormTextInput
          fieldName="projectWebsite"
          title="Project Website*"
          placeholder="https://moonton.io"
        />
      </FormBlock>
      <FormBlock title="Other" watchFieldNames={requiredFields.projectLink}>
        <FormRadioGroup
          fieldName="chain"
          options={chainOptions}
          title="Destination chain*"
        />
        <FormTextInput
          fieldName="liquidity"
          title="How much liquidity will you be adding in the pool?*"
          placeholder="how much?"
        />
        <UploadAsset
          onUploadFile={onUploadFile}
          attachedFiles={attachedFiles}
        />
      </FormBlock>
    </Form>
  );
};
