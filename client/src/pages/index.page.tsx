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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NameLabel } from './@components/NameLabel/NameLabel';
import { StatusIcon } from './@components/StatusIcon/StatusIcon';
import styles from './index.module.css';

// eslint-disable-next-line complexity
const Home = () => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<number>();
  const sortedSeedServices = useMemo(
    () => services.sort((a, b) => a.createdAt - b.createdAt),
    [services]
  );

  const currentService = useMemo(() => {
    if (currentServiceId === undefined) return undefined;
    const index = currentServiceId - 1;
    if (index >= 0 && index < sortedSeedServices.length) {
      return sortedSeedServices[index];
    }
    return undefined;
  }, [sortedSeedServices, currentServiceId]);

  const fetchServices = useCallback(async () => {
    const resuktServices = await apiClient.apps.$get().catch(returnNull);

    if (resuktServices === null) return;
    setServices(resuktServices);

    if (currentServiceId === undefined) {
      setCurrentServiceId(resuktServices.length);
    }
  }, [currentServiceId]);

  // eslint-disable-next-line complexity
  const changeService = (direction: string) => {
    if (currentServiceId === undefined) return;
    if (direction === 'next' && currentServiceId < services.length) {
      setCurrentServiceId(currentServiceId + 1);
    } else if (direction === 'prev' && currentServiceId > 1) {
      setCurrentServiceId(currentServiceId - 1);
    }
  };

  useEffect(() => {
    fetchServices();

    const intervalId = window.setInterval(fetchServices, 5_000);

    return () => clearInterval(intervalId);
  }, [fetchServices]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {currentService && (
          <>
            <StatusIcon status={currentService.status} />
            <Spacer axis="x" size={12} />
            <button onClick={() => changeService('prev')}>&lt;</button>
            <Spacer axis="x" size={12} />
            <span className={styles.indexLabel}>No.{currentServiceId}</span>
            <button onClick={() => changeService('next')}>&gt;</button>
          </>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <MainContainer className={styles.mainContainer}>
          <ChatContainer style={{ background: 'transparent' }}>
            <MessageList style={{ background: 'transparent' }}>
              {currentService && (
                <Message model={{ type: 'custom' } as MessageModel} avatarPosition="tl">
                  <Avatar>
                    <Spacer axis="y" size={26} />
                    <Spacer axis="x" size={4} />
                    <ChatGPTIcon size={32} fill="#fff" />
                  </Avatar>
                  <Message.CustomContent>
                    <NameLabel name="GPT4-turbo" createdTime={currentService.createdAt} />
                    <Spacer axis="y" size={6} />
                    <div>サービス領域：</div>
                    <div>{currentService.area}</div>
                  </Message.CustomContent>
                </Message>
              )}
              {currentService &&
                currentService.ideas.map((idea) => [
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
                  </Message>,
                  idea.feedback && (
                    <Message
                      key={`${idea.id}-feedback`}
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
                  ),
                ])}
              {currentService && currentService.name && currentService.similarName && (
                <Message model={{ type: 'custom' } as MessageModel} avatarPosition="tl">
                  <Avatar>
                    <Spacer axis="y" size={26} />
                    <Spacer axis="x" size={4} />
                    <ChatGPTIcon size={32} fill="#fff" />
                  </Avatar>
                  <Message.CustomContent>
                    <NameLabel name="GPT4-turbo" createdTime={currentService.createdAt} />
                    <Spacer axis="y" size={6} />
                    <div>アプリ名: {currentService.name}</div>
                    <div>類似サービス:{currentService.similarName}</div>
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
