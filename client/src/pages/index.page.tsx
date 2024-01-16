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
import { useState } from 'react';
import { NameLabel } from './@components/NameLabel/NameLabel';
import { StatusIcon } from './@components/StatusIcon/StatusIcon';
import styles from './index.module.css';

const Home = (service: ServiceModel) => {
  const [services, setServices] = useState<ServiceModel[]>([]);

  const fetchServices = async () => {
    const services = await apiClient.apps.$get().catch(returnNull);

    if (services !== null) setServices(services);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIcon status={service.status} />
        <Spacer axis="x" size={12} />
        <span className={styles.indexLabel}>No.{service.id}</span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <MainContainer className={styles.mainContainer}>
          <ChatContainer style={{ background: 'transparent' }}>
            <MessageList
              style={{ background: 'transparent' }}
              // typingIndicator={
              //   props.app.status === 'running' &&
              //   isClosed && (
              //     <TypingIndicator
              //       style={{ background: 'transparent' }}
              //       content="ChatGPTが思考中"
              //     />
              //   )
              // }
            >
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
                        model={{ type: 'custom' } as MessageModel}
                        avatarPosition="tr"
                      >
                        <Avatar>
                          <Spacer axis="y" size={26} />
                          <Spacer axis="x" size={4} />
                          <ChatGPTIcon size={32} fill="#fff" />
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
    </div>
  );
};

export default Home;
