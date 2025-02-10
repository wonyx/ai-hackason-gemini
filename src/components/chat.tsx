import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import { addTasks } from '../actions/add-tasks';
import { getHtmlByTabId } from '../actions/get-html';

export default function Chat() {
  const [activeTabId, setActiveTabId] = useState<number | undefined>();
  const { messages, input, setInput, append, handleInputChange, handleSubmit, addToolResult } = useChat({
    api: import.meta.env.VITE_API_URL,
    maxSteps: 2,
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      console.log('onToolCall', toolCall);
      switch (toolCall.toolName) {
        case 'getHtmlByActiveTab': {
          const html = await getHtmlByTabId({ tabId: activeTabId });
          return html;
        }
        case 'addTasks': {
          // @ts-ignore
          const { description, tasks } = toolCall.args;
          return await addTasks({ description, tasks, });
        }
      }
    },
  });

  useEffect(() => {
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      console.log('activeInfo', activeInfo.tabId);
      setActiveTabId(activeInfo.tabId)
    });
    chrome.tabs.query({ "active": true, "currentWindow": true }, function (tabs) {
      setActiveTabId(tabs[0].id);

      console.log("Current Tab ID is: ", tabs[0].id);
    });
  }, []);

  return (
    <div className='flex flex-col h-[90vh] justify-end'>
      <div className='overflow-scroll'>
        {messages?.map(message => (
          <div key={message.id} className="whitespace-pre-wrap  ">
            <strong>{`${message.role}: `}</strong>
            {message.parts.map(part => {
              switch (part.type) {
                // render text parts as simple text:
                case 'text':
                  return part.text;

                // for tool invocations, distinguish between the tools and the state:
                case 'tool-invocation': {
                  const callId = part.toolInvocation.toolCallId;

                  switch (part.toolInvocation.toolName) {
                    case 'askForConfirmation': {
                      switch (part.toolInvocation.state) {
                        case 'call':
                          return (
                            <div key={callId} className="text-gray-500">
                              {part.toolInvocation.args.message}
                              <div className="flex gap-2">
                                <button
                                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                                  onClick={() =>
                                    addToolResult({
                                      toolCallId: callId,
                                      result: 'Yes, confirmed.',
                                    })
                                  }
                                >
                                  Yes
                                </button>
                                <button
                                  className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                                  onClick={() =>
                                    addToolResult({
                                      toolCallId: callId,
                                      result: 'No, denied',
                                    })
                                  }
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          );
                        case 'result':
                          return (
                            <div key={callId} className="text-gray-500">
                              access allowed:{' '}
                              {part.toolInvocation.result}
                            </div>
                          );
                      }
                      break;
                    }
                    case 'getHtmlByActiveTab': {
                      return <div>getHtmlByActiveTab</div>
                    }
                    case 'addTasks': {
                      switch (part.toolInvocation.state) {
                        case 'call':
                          return (
                            <div key={callId} className="text-gray-500">
                              Adding tasks...
                            </div>
                          );
                        case 'result':
                          return (
                            <div key={callId} className="text-gray-500">
                              Tasks: 追加しました
                            </div>
                          );
                      }
                      break;
                    }
                  }
                }
              }
            })}
            <br />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} >
        <textarea className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          rows={3}
          value={input}
          placeholder='Type a message...'
          onChange={handleInputChange} />
        <div className='flex justify-end'>
          <button type='submit' className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
            Send
          </button>
        </div>
      </form>
    </div>)

}  