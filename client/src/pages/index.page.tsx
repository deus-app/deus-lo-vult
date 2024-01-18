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
      const newIndex =
        direction === 'next'
          ? (prevIndex + 1) % services.length
          : (prevIndex - 1 + services.length) % services.length;

      return newIndex;
    });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {service && (
          <>
            <StatusIcon status={service.status} />
            <Spacer axis="x" size={12} />
            <button onClick={() => changeService('prev')}>&lt;</button>
            <Spacer axis="x" size={12} />
            <span className={styles.indexLabel}>No.{currentServiceIndex}</span>
            <button onClick={() => changeService('next')}>&gt;</button>
          </>
        )}
      </div>
      <MainContainer className={styles.mainContainer}>
        <ChatContainer style={{ background: 'transparent' }}>
          <MessageList style={{ background: 'transparent' }}>
            {service.ideas.map((idea) => {
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
                      <ChatGPTIcon size={32} fill="balck" />
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
                      model={{ type: 'custom' } as MessageModel}
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
          </MessageList>
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Home;
