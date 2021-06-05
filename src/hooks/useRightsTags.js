import { useState, useEffect } from 'react';
import Api from '../utils/api';

export default function useReadWatch({ perPage }) {
  const [rightsData, setRightsData] = useState([]);
  const [tags, setTags] = useState([]);
  let pageCount;

  useEffect(() => {
    Api.getRights()
      .then((data) => {
        setRightsData(data);
        const tagsData = data
          .map((item) => item.tag.name)
          .filter((item, i, arr) => arr.indexOf(item) === i);
        setTags(['Все', ...tagsData]);
        pageCount = Math.ceil(data.length / perPage);
      })
      .catch(console.log);
  }, []);

  return { rightsData, tags, pageCount };
}
