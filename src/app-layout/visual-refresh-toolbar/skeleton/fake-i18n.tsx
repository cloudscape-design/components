// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

const FakeI18n: React.FC = ({ children }) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMount(true);
    }, 300);
  }, []);

  return mount ? children : <div>empty node</div>;
};

export default FakeI18n;
