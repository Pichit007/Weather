import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import axios from 'axios';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);

  const loadOptions = async (inputValue) => {
    const citiesload = await axios.get(`/cities?input=${inputValue}`);
    const citiesList = citiesload.data;

    // สร้างอ็อบเจกต์สำหรับค่าเริ่มต้น
    const defaultOptions = [
      {
        value: '13.7563 100.5018', // ละติจูดและลองจิจูดของกรุงเทพฯ
        label: 'Bangkok, TH',
      },
      {
        value: '13.8701 100.5161', // ละติจูดและลองจิจูดของนนทบุรี
        label: 'Nonthaburi, TH',
      },
      {
        value: '18.7884 98.9853', // ละติจูดและลองจิจูดของเชียงใหม่
        label: 'Chiang Mai, TH',
      },
    ];

    // รวมค่าเริ่มต้นกับข้อมูลที่โหลดจาก API
    const options = citiesList.data.map((city) => {
      return {
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`,
      };
    });

    // คืนค่าอ็อบเจกต์ที่รวมทั้งค่าเริ่มต้นและตัวเลือกอื่นๆ
    return {
      options: [...defaultOptions, ...options], // เพิ่มค่าเริ่มต้นเข้าไปในรายการ
    };
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <AsyncPaginate
      placeholder="ค้นหาเมือง"
      debounceTimeout={600}
      value={searchValue}
      onChange={onChangeHandler}
      loadOptions={loadOptions}
    />
  );
};

export default Search;