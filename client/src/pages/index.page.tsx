import type { ServiceModel } from '$/api/@types/models';
import { Spacer } from '$/components/Spacer';
import { ChatGPTIcon } from '$/components/icons/ChatGPTIcon';
import { apiClient } from '$/utils/apiClient';
import { returnNull } from '$/utils/returnNull';
import type { MessageModel } from '@chatscope/chat-ui-kit-react';
import {
  Avatar,
  ChatContainer,
  MainContainer,
  Message,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useState } from 'react';
import { NameLabel } from './@components/NameLabel/NameLabel';
import { StatusIcon } from './@components/StatusIcon/StatusIcon';
import styles from './index.module.css';

// eslint-disable-next-line complexity
const Home = () => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const service = services[currentServiceIndex];

  const fetchServices = async () => {
    const services = await apiClient.apps.$get().catch(returnNull);

    if (services !== null) {
      setServices(services);
    }
  };

  const changeService = (direction: string) => {
    setCurrentServiceIndex((prevIndex) => {
      const newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;

      return newIndex;
    });
  };

  useEffect(() => {
    fetchServices();

    const intervalId = window.setInterval(fetchServices, 5_000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      {service && (
        <div className={styles.header}>
          <StatusIcon status={service.status} />
          <Spacer axis="x" size={12} />
          <button onClick={() => changeService('prev')}>&lt;</button>
          <Spacer axis="x" size={12} />
          <span className={styles.indexLabel}>No.{currentServiceIndex}</span>
          <button onClick={() => changeService('next')}>&gt;</button>
        </div>
      )}
      <div style={{ flex: 1, position: 'relative' }}>
        <MainContainer className={styles.mainContainer}>
          <ChatContainer style={{ background: 'transparent' }}>
            <MessageList style={{ background: 'transparent' }}>
              {service &&
                service.ideas.map((idea) => {
                  return (
                    <>
                      <Message
                        key={idea.id}
                        model={{ type: 'custom' } as MessageModel}
                        avatarPosition="tl"
                      >
                        <Avatar>
                          <Spacer axis="y" size={26} />
                          <Spacer axis="x" size={4} />
                          <ChatGPTIcon size={32} fill="#fff" />
                        </Avatar>
                        <Message.CustomContent>
                          <NameLabel name="GPT4-turbo" createdTime={idea.createdAt} />
                          <Spacer axis="y" size={6} />
                          <div>{idea.description}</div>
                        </Message.CustomContent>
                      </Message>
                      {idea.feedback && (
                        <Message
                          key={idea.id}
                          model={{ type: 'custom', direction: 'outgoing' } as MessageModel}
                          avatarPosition="tr"
                        >
                          <Avatar>
                            <Spacer axis="y" size={26} />
                            <Spacer axis="x" size={4} />
                            <ChatGPTIcon size={32} fill="#aaa" />
                          </Avatar>
                          <Message.CustomContent>
                            <NameLabel name="GPT4-turbo" createdTime={idea.feedback.createdAt} />
                            <Spacer axis="y" size={6} />
                            <div>{idea.feedback.feedback}</div>
                          </Message.CustomContent>
                        </Message>
                      )}
                    </>
                  );
                })}
              {service && service.name && service.similarName && (
                <Message model={{ type: 'custom' } as MessageModel} avatarPosition="tl">
                  <Avatar>
                    <Spacer axis="y" size={26} />
                    <Spacer axis="x" size={4} />
                    <ChatGPTIcon size={32} fill="#fff" />
                  </Avatar>
                  <Message.CustomContent>
                    <NameLabel name="GPT4-turbo" createdTime={service.createdAt} />
                    <Spacer axis="y" size={6} />
                    <div>アプリ名: {service.name}</div>
                    <div>類似サービス:{service.similarName}</div>
                  </Message.CustomContent>
                </Message>
              )}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default Home;
