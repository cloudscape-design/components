// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export const navigateToItem = (id: string) => {
  if (id) {
    const el = document.getElementById(id.slice(1));
    el?.scrollIntoView();
  }
};

export const TextSample = () => (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet arcu dapibus, pellentesque ipsum eget,
    cursus tellus. Mauris porta maximus dolor eget gravida. Curabitur pulvinar neque sed lectus commodo, nec efficitur
    orci pretium. Phasellus ultrices lorem non turpis egestas, a tincidunt turpis lobortis. Nulla a est quis eros tempus
    consectetur. Vivamus ultricies pharetra porta. Etiam id rutrum neque. Praesent sagittis ipsum in lorem pretium, ut
    auctor nulla consectetur. Quisque aliquam sollicitudin consectetur. Orci varius natoque penatibus et magnis dis
    parturient montes, nascetur ridiculus mus. Vivamus quam risus, iaculis eget arcu eu, porttitor blandit est. Cras
    quam ligula, efficitur vitae pulvinar vitae, luctus eget velit. Proin mattis sed purus sit amet gravida. Donec nec
    hendrerit nibh, eu dapibus sapien. Aenean sollicitudin ante quis vestibulum eleifend. Praesent quis porta lectus.
    Phasellus in nunc commodo, convallis ante eu, efficitur purus. Fusce vitae accumsan justo, sit amet pellentesque
    elit. Mauris rhoncus eros in pulvinar semper. Sed luctus, dui sit amet ultricies vulputate, mauris orci ullamcorper
    ipsum, in fermentum arcu turpis eget neque. Maecenas in arcu sit amet est tempor tincidunt quis vitae nibh.
    Vestibulum id blandit tortor. Nulla sed pharetra purus, at imperdiet magna. Suspendisse venenatis, lacus at sodales
    volutpat, diam dui dictum lacus, a ultricies neque lorem id sapien. Vestibulum viverra aliquet dolor, eu
    sollicitudin enim dapibus non. Pellentesque quis augue egestas nibh tempor ornare. Vivamus posuere tincidunt ipsum
    eu hendrerit. Aliquam ante dolor, pulvinar at dapibus vitae, efficitur ut elit. Vivamus nisi est, tincidunt sit amet
    congue quis, ultrices dictum risus. Curabitur mollis at enim vitae rutrum. Class aptent taciti sociosqu ad litora
    torquent per conubia nostra, per inceptos himenaeos. Donec dictum felis ac tortor dignissim, quis aliquam quam
    sagittis. Sed lacinia molestie risus, id elementum nibh posuere sed. Suspendisse ante odio, euismod vel mauris id,
    pellentesque rhoncus massa. Vivamus ultrices erat eros, non eleifend dolor tempor a. Fusce placerat vehicula nulla
    et tempor. Sed scelerisque ipsum id lorem suscipit faucibus. Sed suscipit tortor lectus, et dignissim elit dignissim
    ut. Nunc dictum ex quis condimentum lobortis. Morbi non aliquet metus, eu congue est. Suspendisse volutpat dui sit
    amet nulla semper, a aliquet sem rhoncus. Mauris eu magna elementum augue luctus pellentesque. Vivamus risus lectus,
    mattis nec aliquam a, tincidunt eu erat. Duis volutpat eu tellus quis euismod. Fusce congue justo ut leo sodales
    volutpat. Nullam elit magna, ultricies in fermentum sed, semper ac lorem. Sed odio odio, fermentum nec fringilla at,
    ullamcorper in ipsum. Pellentesque a magna lorem. Donec eu sapien tincidunt, fringilla leo sit amet, consequat leo.
    Suspendisse iaculis ipsum et quam vehicula, ac rutrum purus gravida. Curabitur non commodo sem. Proin accumsan, orci
    non porttitor pharetra, tortor augue commodo tellus, in pharetra ante mi non mi. Morbi eget malesuada lorem. Mauris
    erat est, hendrerit sed sem non, ornare ultrices dolor. Sed nec eros ac leo auctor tincidunt. Vestibulum euismod
    ante sed blandit interdum. Donec aliquam libero eu mi posuere tempor. Vestibulum non nunc ut augue malesuada
    tincidunt. Cras sit amet dui placerat, blandit odio eget, vehicula erat. Cras turpis diam, pharetra vel malesuada
    eu, rutrum ut magna. Donec eget turpis quis dui pellentesque commodo id sit amet nisl. Integer sit amet iaculis
    turpis. Aenean vitae porta nulla. Mauris vitae ligula sit amet diam molestie mattis. Aliquam venenatis eget dolor eu
    aliquet. Sed interdum rutrum risus eget dignissim. Nunc porttitor faucibus dignissim. Orci varius natoque penatibus
    et magnis dis parturient montes, nascetur ridiculus mus. Nullam scelerisque eu velit ac lobortis. Mauris finibus, ex
    a auctor auctor, orci massa dapibus dolor, ac varius orci ex fermentum mauris. Ut imperdiet bibendum eros, non
    fringilla mauris porttitor nec. Nunc eleifend felis nunc, vel pellentesque nunc mattis nec. Morbi in maximus lectus,
    quis dictum leo. Aliquam sollicitudin est felis, nec tristique mauris molestie vel. Quisque vel est at lectus
    egestas scelerisque tincidunt id lectus. Nam sed ullamcorper mauris, sed lobortis lacus. Ut venenatis nisl lorem,
    vel viverra ipsum scelerisque ut. Aliquam vitae consequat justo, sit amet tristique arcu. Donec tempus auctor velit,
    quis elementum velit ultricies non. Morbi semper eu neque sed ultricies. Pellentesque congue quam vel varius
    interdum. Suspendisse potenti. Suspendisse vel tortor non libero dapibus egestas commodo sit amet nisl. Sed velit
    nulla, finibus vel porttitor vitae, hendrerit sit amet magna. Cras massa nulla, euismod at fringilla quis, ornare
    varius libero. Nunc in ante in nibh hendrerit cursus ac ut turpis. Maecenas vitae odio sed quam suscipit convallis
    vel et urna. Maecenas metus velit, dapibus nec aliquam vel, bibendum eget eros. Integer dignissim, sapien in
    imperdiet consequat, eros risus rhoncus enim, ac sollicitudin velit eros ac nunc. Sed ut dolor in nulla iaculis
    pretium. Curabitur ligula turpis, sollicitudin nec turpis eget, cursus varius turpis. Donec risus odio, varius in
    egestas ut, cursus viverra purus. Cras vitae nisi vulputate, consectetur ante non, egestas urna. Suspendisse
    tristique ante arcu, porttitor ultrices tellus laoreet sit amet. Vestibulum neque turpis, posuere sed cursus quis,
    maximus ac neque. Sed ac dui scelerisque, luctus sapien id, faucibus nibh. Aliquam eu metus pellentesque, rutrum ex
    vel, ornare sapien. Nullam eleifend leo vel magna maximus congue. Etiam a purus quis est porttitor scelerisque sed
    eu dolor. Nam at auctor nisl. Ut blandit blandit mauris, in aliquet felis. Praesent vitae leo laoreet, congue dolor
    sit amet, maximus magna. Duis aliquam mollis eros, ut ultricies augue dignissim sit amet. Nulla rutrum, nisi sed
    varius tincidunt, lacus ligula gravida leo, ut sollicitudin ante eros vitae erat. Quisque laoreet sodales enim sit
    amet tempor. Proin auctor mollis urna ac condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
    eget ipsum fringilla, dapibus ex vitae, egestas diam. Mauris tempus sollicitudin semper. Aenean in massa vel lorem
    varius tincidunt. Vivamus hendrerit venenatis tempor. Orci varius natoque penatibus et magnis dis parturient montes,
    nascetur ridiculus mus. Cras suscipit est ut pulvinar malesuada. Aenean facilisis ipsum vitae neque tincidunt, eu
    faucibus diam placerat. In ullamcorper ante urna, vitae auctor tellus placerat non. Donec augue nibh, accumsan eget
    fringilla a, sodales ac elit. Curabitur eros massa, ullamcorper nec neque ut, venenatis eleifend tellus.
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce non blandit mi.
    Maecenas lacinia nulla quis lobortis convallis. Vestibulum commodo, dui et porta interdum, lacus ipsum hendrerit
    risus, sed pellentesque tellus magna non justo. Sed vel ex quis quam luctus pellentesque. Cras euismod, nisl nec
    lacinia luctus, lectus turpis auctor risus, dictum varius sapien elit eu mi. Etiam sit amet libero velit.
    Suspendisse dignissim ligula elit, eget viverra diam suscipit a. Aenean ac odio sed tellus mattis hendrerit.
    Phasellus metus tellus, pellentesque a efficitur id, sollicitudin vel ipsum. Integer ultricies nisl metus, nec
    consequat tortor iaculis a. Fusce interdum ut augue eu molestie. Nunc eu congue mi. Nullam scelerisque, nisi eget
    ullamcorper lacinia, enim eros cursus arcu, gravida rhoncus dui augue id eros. Sed euismod lacus eget mauris
    tincidunt, sit amet finibus risus rhoncus. Donec sed hendrerit felis. Aliquam metus diam, congue eu porttitor id,
    gravida in libero. Aliquam convallis tempor ultrices. Praesent eleifend ultricies felis vitae ullamcorper. Nam eu
    nisi odio. Morbi a urna ut felis pulvinar dapibus. Proin varius varius augue et sollicitudin. Nulla augue nisl,
    euismod sit amet lobortis ut, pharetra vitae sem. Mauris luctus viverra felis, non consectetur leo. Suspendisse
    potenti. Pellentesque fermentum et eros sit amet tincidunt. Aliquam quis vulputate justo, eget rhoncus turpis.
    Phasellus luctus lacus id nisl vulputate malesuada. Cras aliquet, mauris non convallis lacinia, turpis est eleifend
    ipsum, quis rutrum risus turpis eget metus. Quisque finibus ut erat sit amet mollis. Donec purus magna, vehicula
    eget ultricies nec, rutrum eu dui. Vestibulum enim justo, bibendum nec auctor eget, tempor ac augue. Donec nec nulla
    sed diam auctor tempor eu quis diam. Curabitur vitae congue tortor. Duis consectetur sem quis mattis convallis.
    Etiam dapibus metus eu dui luctus egestas. Nam aliquam, metus eu faucibus mollis, eros magna congue quam, nec
    hendrerit nunc risus ac est. Pellentesque a velit a leo porttitor tristique a eu enim. Curabitur varius, sapien non
    mattis pretium, tellus nisl vestibulum lectus, sed auctor justo leo ut leo. Ut volutpat, nisi eget feugiat finibus,
    odio ex vestibulum nisi, eu gravida dui erat elementum erat. Donec sed est a odio cursus ultricies. Pellentesque sed
    dolor vulputate, tristique ex at, luctus lacus. Etiam cursus finibus dui eget ultricies. Etiam feugiat feugiat
    purus, sed malesuada nibh scelerisque sit amet. Ut consectetur enim metus, non cursus massa rutrum at. Etiam purus
    leo, placerat et dolor vitae, luctus dapibus nisi. Vestibulum ac sem nunc. Aenean viverra orci at mi ultricies, at
    congue libero dignissim. Pellentesque ultricies, est non luctus luctus, mi arcu ultricies enim, at malesuada enim
    quam sed purus. Duis vel erat ac justo semper luctus. Nullam congue nulla magna, eu placerat ex tempus eu. Mauris
    neque nunc, tristique a semper id, bibendum ac mauris. Nulla gravida at orci sit amet ullamcorper. Aenean posuere
    leo at hendrerit malesuada. Etiam sed leo volutpat, mattis lacus in, sodales odio. Cras eget ipsum dolor. Phasellus
    blandit maximus tortor, sit amet semper ex malesuada sed. Duis ultricies auctor sem, ut dictum ante ullamcorper ut.
    Pellentesque laoreet vel risus nec iaculis. Duis viverra, odio a lobortis sollicitudin, dolor ante hendrerit dui, id
    varius justo neque quis neque. Aliquam ligula justo, pharetra vel viverra ac, maximus eget nunc. Nulla vitae metus
    facilisis, suscipit ex eget, finibus magna. Nam gravida elementum libero, id venenatis ligula euismod et. Etiam
    rutrum turpis vel libero efficitur, sit amet molestie tortor ultricies. Pellentesque sapien massa, malesuada ut diam
    at, convallis lobortis lectus. Suspendisse sodales lacinia arcu non lacinia. Integer malesuada orci feugiat augue
    bibendum accumsan. Praesent a tortor quis diam molestie gravida. Sed auctor sapien quis blandit aliquet. Vestibulum
    at quam pulvinar, efficitur erat eu, malesuada tortor. Sed mi arcu, faucibus et arcu sodales, malesuada auctor
    tellus. In eleifend, libero nec dictum faucibus, ligula nibh sagittis ante, eget feugiat nibh tellus ac turpis. Sed
    rhoncus commodo lacus ut malesuada. Praesent ac vehicula urna. Donec felis sem, vehicula ut leo eget, venenatis
    suscipit metus. Etiam at congue erat. Sed malesuada egestas diam, eget dapibus enim porta et. Aliquam vitae purus
    sed dolor ullamcorper sagittis. Sed vitae congue elit. Curabitur ut libero enim. Etiam et aliquam nisi, ultrices
    porta massa. Praesent tristique quam tellus, id aliquam elit lacinia et. Maecenas luctus sed metus ut rhoncus.
    Suspendisse sit amet mollis ante. Vivamus tincidunt purus eget faucibus porttitor. Phasellus eleifend, sapien eget
    dignissim volutpat, metus nisl ultricies est, sed eleifend tortor lectus sed mauris. Nunc molestie consequat neque
    sit amet tempus. Cras ac ex vel arcu porta aliquet. Ut ultricies blandit purus, eget ullamcorper velit semper
    pharetra. Pellentesque odio nulla, iaculis sit amet luctus ut, gravida ac ipsum. Sed nec urna a leo eleifend
    volutpat et quis felis. In hac habitasse platea dictumst. Fusce ultricies pretium diam, quis ultrices justo. In
    vestibulum enim a ante consectetur, sit amet finibus nisl hendrerit. Aliquam viverra id sem in aliquam. Etiam vel
    vehicula mi. Fusce molestie ultricies pulvinar. Sed semper sit amet mauris ac tincidunt. Vivamus ac congue arcu, vel
    pellentesque lectus. Vestibulum aliquet commodo ex, vel vestibulum urna venenatis ac. Donec dolor mauris, cursus at
    felis eu, porttitor porttitor lectus. Ut in leo dolor. Nam at nisl vulputate, ullamcorper neque vitae, pulvinar
    lorem. Nam mollis sodales eros sagittis maximus. Integer enim dolor, suscipit non semper sit amet, accumsan nec
    tellus. Quisque suscipit enim ipsum, et mattis nibh aliquet vel. Morbi id tempus neque. Vestibulum a eros dui.
    Aenean est velit, iaculis eget iaculis non, eleifend eget augue. In cursus ullamcorper nisi, vel aliquet nibh
    venenatis ac. Aenean nisi nibh, mollis quis aliquam eget, accumsan eget elit. Ut sed odio auctor, lobortis ipsum eu,
    lobortis odio. Mauris tincidunt blandit augue in tempor. Pellentesque non lacus convallis libero pulvinar
    condimentum nec eget arcu. Vivamus cursus volutpat justo consequat laoreet. Aliquam id enim consectetur, varius
    felis quis, egestas turpis. Nam iaculis quam diam, sed fermentum nunc elementum sed. Pellentesque ultricies nisl
    imperdiet leo placerat, at dapibus lacus congue. Donec quis auctor libero. Duis tellus odio, faucibus vitae mattis
    eu, placerat nec tortor. Nulla interdum massa vitae luctus hendrerit. Pellentesque hendrerit metus faucibus nisl
    semper maximus ut sed nisl. Nulla facilisi. Nullam eu ipsum mattis, aliquet est iaculis, volutpat libero. Morbi id
    porttitor orci. Proin aliquet libero vitae lobortis faucibus. Vestibulum ante ipsum primis in faucibus orci luctus
    et ultrices posuere cubilia curae; Aliquam viverra dictum purus non tempus. Cras in justo tincidunt magna facilisis
    vulputate. Morbi ultricies mauris augue, at consequat augue sollicitudin sed. Aenean a augue non arcu pellentesque
    ullamcorper. Aliquam vulputate nunc ut elementum feugiat. Suspendisse convallis mi in maximus auctor. Maecenas
    tempor pulvinar lorem. Aliquam ex tortor, eleifend in dolor id, placerat venenatis dui. Etiam volutpat augue quis
    odio pulvinar accumsan. Nulla eu mi lobortis, condimentum ante vitae, elementum arcu. Mauris fermentum justo non
    elementum semper. Nunc et sagittis urna, ac mollis dolor. Nulla congue ligula in cursus pellentesque. Duis eget
    sagittis risus. Morbi sit amet dictum odio. Suspendisse accumsan ornare lobortis. Quisque efficitur suscipit
    dignissim. Proin risus lectus, scelerisque sit amet bibendum et, ultricies ac lorem. Cras fringilla magna ut lacus
    ultrices, non facilisis metus accumsan. Vestibulum blandit blandit hendrerit. Etiam pharetra dui non luctus
    consequat. Integer vulputate metus at iaculis consectetur. Etiam lobortis nulla turpis, non varius orci consectetur
    sit amet. Morbi interdum ipsum sit amet quam blandit aliquet. In eu ex sit amet ante pulvinar hendrerit. Vestibulum
    quis velit hendrerit, congue sem porttitor, commodo magna. Pellentesque in sem non magna eleifend dictum. Morbi
    ullamcorper molestie pretium. Proin a eros rutrum, volutpat urna quis, congue purus. Morbi accumsan arcu ullamcorper
    metus tincidunt, id luctus quam condimentum. Morbi sed neque ex. Mauris vel orci velit. Sed vitae nisi at enim
    interdum efficitur. Sed ante tortor, faucibus vel cursus interdum, lacinia eu ipsum. Integer ac gravida arcu, id
    eleifend massa. Pellentesque ut risus libero. Morbi ut sem eget erat mollis sagittis nec a nibh. Etiam quis erat ut
    lectus imperdiet placerat. Pellentesque ac est sit amet est placerat tincidunt. Sed rutrum imperdiet arcu, ut
    tincidunt nisi gravida vel. Sed eu eros vel lectus gravida aliquet a quis enim. Integer hendrerit volutpat nunc quis
    mattis. Sed feugiat felis vitae erat volutpat pharetra. Integer accumsan urna vel velit eleifend sagittis. Proin sed
    convallis urna, non ullamcorper libero. Duis venenatis finibus ante ut finibus. Proin at facilisis nisl. Nulla
    interdum tellus vitae enim porta condimentum. Integer nec risus nibh. Cras hendrerit facilisis sagittis. Suspendisse
    in lectus turpis. In pulvinar ipsum sit amet velit condimentum sagittis. Cras sit amet est ac lacus vulputate
    viverra sed et sapien. Pellentesque tempor ornare diam ut pellentesque. Nulla quis gravida diam. Aenean non orci sed
    nulla sodales sagittis. Integer quis risus odio. Ut ultricies, nisl non ultricies tempor, quam ipsum iaculis enim,
    quis ornare lorem turpis eget lorem. Aliquam erat volutpat. Praesent laoreet metus sit amet magna dignissim cursus.
    Duis congue dui turpis, at posuere nulla interdum eu. Aenean id laoreet ante, eu elementum nisl. Mauris eget dui a
    magna volutpat pulvinar. Sed interdum viverra quam, et iaculis sapien. In eget nulla justo. Suspendisse potenti.
    Donec lacinia quis risus sit amet hendrerit. Donec accumsan dui eu nibh convallis, at interdum libero facilisis.
    Nullam rhoncus a velit non maximus. Sed nulla diam, eleifend eu accumsan non, sagittis vel dolor. Integer euismod
    nec enim vitae feugiat. Mauris vel neque sapien. Phasellus faucibus auctor erat, a ullamcorper tellus ultrices at.
    Donec nec odio nec elit ornare auctor scelerisque quis enim. Sed aliquet varius quam nec ultrices. Donec iaculis
    lobortis diam, id eleifend lacus tristique a. Nunc id nulla mauris. Ut vitae vestibulum ipsum, volutpat tempus
    felis. Integer nibh risus, feugiat tincidunt mauris at, malesuada luctus nisl. Aenean laoreet rutrum tristique. Cras
    accumsan auctor ex, sit amet efficitur turpis consectetur vitae. Sed pretium orci sit amet porttitor pharetra. Ut
    eget vestibulum odio. Aenean lobortis nec sem ac imperdiet. Duis orci ipsum, pellentesque ut ipsum ut, cursus mattis
    felis. Duis a enim congue, pharetra arcu nec, ultrices ante. Nam iaculis massa eget lectus ultricies bibendum.
    Nullam consectetur tincidunt mi, vitae ullamcorper tortor luctus vitae. Fusce non malesuada augue. Donec non
    fermentum turpis. Suspendisse potenti. Donec justo sapien, tristique vitae efficitur eget, commodo in urna. Nunc id
    dui nec lorem cursus bibendum eget sed ipsum. Pellentesque non tempor massa. Aliquam ac cursus ligula. Maecenas
    ultrices justo erat, vel convallis ante euismod id. Proin metus velit, convallis a pulvinar et, fermentum eu massa.
    Sed ac purus lacus. Nullam sit amet ante in turpis porta dapibus eu non turpis. Maecenas sit amet lectus libero. Nam
    porttitor in nisi in fringilla. Pellentesque non iaculis quam. In dapibus, dui a rutrum tincidunt, arcu neque
    blandit ipsum, nec laoreet sapien lorem et sem. Mauris ac diam suscipit, euismod sem nec, consectetur orci. Donec
    rhoncus consequat neque condimentum vehicula. Quisque augue arcu, porta pellentesque euismod ac, consequat vel
    velit. Maecenas sagittis enim a nulla ullamcorper sagittis. In id imperdiet nunc, sit amet pulvinar ex. Nam sit amet
    faucibus justo. Praesent vulputate ipsum in ultrices convallis. In vehicula, tellus ac aliquam porttitor, erat magna
    venenatis nibh, sit amet viverra mauris ipsum ac massa. Maecenas vitae arcu vel ante tempor aliquam sed a dui.
    Aenean scelerisque diam risus, nec fermentum quam posuere quis. Suspendisse potenti. Nulla eget imperdiet est, vel
    placerat lectus. Phasellus condimentum varius odio eget mattis. Aenean id mi mi. Sed tempus urna ac ornare porta.
    Curabitur vulputate justo arcu, sed ultrices leo cursus at. Class aptent taciti sociosqu ad litora torquent per
    conubia nostra, per inceptos himenaeos. Sed ultricies luctus velit, id eleifend enim ornare quis. Sed commodo
    tristique ex, vitae viverra nulla dictum vel. Nullam viverra nunc id justo varius blandit. Vivamus tincidunt metus
    viverra varius condimentum. Nulla non lectus at dui accumsan lacinia ac vel libero. In hendrerit urna a fringilla
    aliquam. Praesent porttitor porttitor augue, quis lacinia tellus vulputate ac.
  </p>
);
