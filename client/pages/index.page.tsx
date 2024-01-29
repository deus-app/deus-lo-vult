import type { MessageModel } from '@chatscope/chat-ui-kit-react';
import {
  Avatar,
  ChatContainer,
  MainContainer,
  Message,
  MessageList,
} from '@chatscope/chat-ui-kit-react';
import type { ServiceModel } from 'api/@types';
import { NameLabel } from 'components/NameLabel/NameLabel';
import { StatusIcon } from 'components/StatusIcon/StatusIcon';
import { Spacer } from 'features/Spacer';
import { ChatGPTIcon } from 'features/icons/ChatGPTIcon';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { returnNull } from 'utils/returnNull';
import styles from './index.module.css';

// eslint-disable-next-line complexity
const Home = () => {
  const router = useRouter();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [currentServiceId, setCurrentServiceId] = useState<number>();
  const currentService = useMemo(() => {
    if (currentServiceId === undefined) return undefined;
    return services.find((service) => service.id === currentServiceId);
  }, [services, currentServiceId]);
  const fetchServices = useCallback(async () => {
    const resuktServices = await apiClient.apps.$get().catch(returnNull);

    if (resuktServices === null) return;
    setServices(resuktServices);
    if (currentServiceId === undefined) {
      setCurrentServiceId(resuktServices.length);
    }
  }, [currentServiceId]);

  const increaseServiceId = () => {
    if (currentServiceId && currentServiceId < services.length) {
      const newServiceId = currentServiceId + 1;
      router.push(`/?id=${newServiceId}`, undefined, { shallow: true });
    }
  };
  const decreaseServiceId = () => {
    if (currentServiceId && currentServiceId > 1) {
      const newServiceId = currentServiceId - 1;
      router.push(`/?id=${newServiceId}`, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    fetchServices();

    const intervalId = window.setInterval(fetchServices, 5_000);

    return () => clearInterval(intervalId);
  }, [fetchServices]);

  useEffect(() => {
    const queryId = parseInt(router.query.id as string);
    if (!isNaN(queryId) && queryId >= 1 && queryId <= services.length) {
      setCurrentServiceId(queryId);
    }
  }, [router.query.id, services.length]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {currentService && (
          <>
            <StatusIcon status={currentService.status} />
            <Spacer axis="x" size={12} />
            <span className={styles.indexLabel}>No.{currentService.id}</span>
            <Spacer axis="x" size={12} />
            <button onClick={decreaseServiceId}>&lt;</button>
            <Spacer axis="x" size={12} />
            <button onClick={increaseServiceId}>&gt;</button>
          </>
        )}
      </div>
      <div style={{ height: 'calc(100vh - 48px)', position: 'relative' }}>
        <MainContainer className={styles.mainContainer}>
          <ChatContainer style={{ background: 'transparent' }}>
            <MessageList autoScrollToBottom={true} style={{ background: 'transparent' }}>
              {currentService && (
                <Message model={{ type: 'custom' } as MessageModel} avatarPosition="tl">
                  <Avatar>
                    <Spacer axis="y" size={26} />
                    <Spacer axis="x" size={4} />
                    <ChatGPTIcon size={32} fill="#000" />
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
                      <ChatGPTIcon size={32} fill="#000" />
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
                        <ChatGPTIcon size={32} fill="#000" />
                      </Avatar>
                      <Message.CustomContent>
                        <NameLabel name="GPT4-turbo" createdTime={idea.feedback.createdAt} />
                        <Spacer axis="y" size={6} />
                        <div>{idea.feedback.feedback}</div>
                      </Message.CustomContent>
                    </Message>
                  ),
                ])}
              {currentService && currentService.status === 'finished' && (
                <Message model={{ type: 'custom' } as MessageModel} avatarPosition="tl">
                  <Avatar>
                    <Spacer axis="y" size={26} />
                    <Spacer axis="x" size={4} />
                    <ChatGPTIcon size={32} fill="#000" />
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
