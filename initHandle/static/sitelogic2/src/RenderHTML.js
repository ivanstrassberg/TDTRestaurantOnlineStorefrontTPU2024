import React, { useState, useEffect } from 'react';

const RenderHtmlPage = ({ url }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setHtmlContent(text);
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    fetchHtmlContent();
  }, [url]);

  useEffect(() => {
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      newScript.src = oldScript.src;
      newScript.async = oldScript.async;
      document.body.appendChild(newScript);
    });

    return () => {
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, [htmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default RenderHtmlPage;
