import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import ContentCard from '../app/review/components/content-card';
import ContentMetadataCard from '../app/review/components/content-metadata-card';
import UserMetadataCard from '../app/review/components/user-metadata-card';
 
describe('Content card rendering', () => {
  it('renders text', () => {
    const { getByText } = render(
      <ContentCard
        contentType='text'
        text='this is a test'
        imgUrl={null}
      />
    );

    expect(getByText("this is a test")).toBeInTheDocument();
  });
});

describe('Content metadata card rendering', () => {
  it('Is blank', () => {
    const { getByText, queryByText } = render(
      <ContentMetadataCard />
    );

    expect(getByText("Content Info")).toBeInTheDocument();
    expect(queryByText("ID")).toBeNull();
    expect(queryByText("Creation Time")).toBeNull();
    expect(queryByText("Additional Information")).toBeNull();
  });

  it('renders without additional info', () => {
    const { getByText, queryByText } = render(
      <ContentMetadataCard
        id="abc123"
        createTime="2023-05-12 10:00AM"
        additionalInfo={null}
      />
    );

    expect(getByText("Content Info")).toBeInTheDocument();
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("abc123")).toBeInTheDocument();
    expect(getByText("Creation Time")).toBeInTheDocument();
    expect(getByText("2023-05-12 10:00AM")).toBeInTheDocument();
    expect(queryByText("Additional Information")).toBeNull();
  });

  it('renders with additional info', () => {
    const { getByText, queryByText } = render(
      <ContentMetadataCard
        id="abc123"
        createTime="2023-05-12 10:00AM"
        additionalInfo="More info here"
      />
    );

    expect(getByText("Content Info")).toBeInTheDocument();
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("abc123")).toBeInTheDocument();
    expect(getByText("Creation Time")).toBeInTheDocument();
    expect(getByText("2023-05-12 10:00AM")).toBeInTheDocument();
    expect(getByText("Additional Information")).toBeInTheDocument();
    expect(getByText("More info here")).toBeInTheDocument();
  });
});

describe('User metadata card rendering', () => {
  it('Is blank', () => {
    const { getByText, queryByText } = render(
      <UserMetadataCard />
    );

    expect(getByText("User Info")).toBeInTheDocument();
    expect(queryByText("ID")).toBeNull();
    expect(queryByText("Name")).toBeNull();
    expect(queryByText("Email")).toBeNull();
    expect(queryByText("Phone Number")).toBeNull();
    expect(queryByText("Additional Information")).toBeNull();
  });

  it('renders without additional info', () => {
    const { getByText, queryByText } = render(
      <UserMetadataCard
        id="15"
        name="Johnny Doe"
        email="john@doe.com"
        phoneNumber='+15101111111'
        additionalInfo={null}
      />
    );

    expect(getByText("User Info")).toBeInTheDocument();
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("15")).toBeInTheDocument();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Johnny Doe")).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("john@doe.com")).toBeInTheDocument();
    expect(getByText("Phone Number")).toBeInTheDocument();
    expect(getByText("+15101111111")).toBeInTheDocument();
    expect(queryByText("Additional Information")).toBeNull();
  });

  it('renders with additional info', () => {
    const { getByText, queryByText } = render(
      <UserMetadataCard
        id="15"
        name="Johnny Doe"
        email="john@doe.com"
        phoneNumber='+15101111111'
        additionalInfo="Some more user info"
      />
    );

    expect(getByText("User Info")).toBeInTheDocument();
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("15")).toBeInTheDocument();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Johnny Doe")).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("john@doe.com")).toBeInTheDocument();
    expect(getByText("Phone Number")).toBeInTheDocument();
    expect(getByText("+15101111111")).toBeInTheDocument();
    expect(getByText("Additional Information")).toBeInTheDocument();
    expect(getByText("Some more user info")).toBeInTheDocument();
  });
});