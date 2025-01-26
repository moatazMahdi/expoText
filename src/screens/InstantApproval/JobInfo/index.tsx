import React, {useEffect, useState} from 'react';
import {I18nManager, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultTextInput from 'src/components/DefaultTextInput';
import {ContinueLater} from 'src/components/ContinueLater';
import DefaultDropdown from 'src/components/DefaultDropdown';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {ContinueButton, PageTitle} from 'components';
import {hp} from 'src/utils/Dimensions/dimen';
import {
  jobTitles,
  jobTitlesEn,
  workYears,
  workYearsEn,
} from '../../InstantApproval/clientInfo/data';
import {
  getTextColor,
  saveInstantApprovalProgress,
} from 'src/utils/HelpersFunctions';
import styles from './styles';

export const JobInfo = () => {
  const {
    nationalId,
    categoriesData,
    selfiePic,
    dependencies,
    refContact,
    employmentStatus,
    companyDetails,
    residentialStatus,
    userInputNationalId,
    personalDetails,
    referralType,
    referralCode,
    hasPromoCode,
  } = (useRoute().params as any) || {};

  const {selectStyle} = useStyles(styles);
  const navigation = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const [workExperience, setWorkExperience] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [salary, setSalary] = useState('');

  const spaceBetween = {marginBottom: hp(20)};

  const navigateToNextScreen = async () => {
    setIsLoading(true);
    // Save Progress First Before Navigating to Next Screen
    ApplicationAnalytics(
      {
        eventKey: 'employment_info_continue',
        type: 'CTA',
        parameters: {
          salary: salary ?? '',
          jobTitle: jobTitle ?? '',
          workExperience: workExperience ?? '',
        },
      },
      stores,
    );

    const progress = {
      name: 'additionalDocs',
      params: {
        nationalId,
        categoriesData,
        selfiePic,
        dependencies,
        refContact,
        employmentStatus,
        companyDetails,
        salary,
        jobTitle,
        workExperience,
        residentialStatus,
        userInputNationalId,
        personalDetails,
        referralType,
        referralCode,
        hasPromoCode,
      },
    };

    await saveInstantApprovalProgress(progress);

    // Navigate to Next Screen
    navigation.navigate(progress);

    setIsLoading(false);
  };

  useEffect(() => {
    if (salary && jobTitle && workExperience) {
      setFormValid(true);
    } else {
      formValid && setFormValid(false);
    }
  }, [salary, jobTitle, workExperience]);

  const renderEmploymentStatusDescription = () => {
    return (
      <View style={selectStyle('employmentStatusDescriptionContainer')}>
        <Typography
          customStyles={() => ({
            text: selectStyle('employmentStatusDescription'),
          })}>
          {translate('ROLE_IN_COMPANY')}
        </Typography>
      </View>
    );
  };

  const listWorkExperience = () => {
    const workExperience = I18nManager.isRTL
      ? workYears?.map(item => ({label: item, value: item}))
      : workYearsEn?.map(item => ({label: item, value: item}));
    return workExperience;
  };

  const renderExperienceList = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('HOW_LONG_BEEN_WORKING')}
          data={listWorkExperience()}
          value={workExperience}
          onChange={item => setWorkExperience(item)}
          textColor={getTextColor(workExperience)}
        />
      </View>
    );
  };

  const validateSalary = (salary: string) => {
    const regex = /^\d+$/;
    if (regex.test(salary)) {
      salary.replace(/^0+/, '');
      setSalary(salary.replace(/^0+/, ''));
    } else if (salary.length === 0) {
      setSalary('');
    }
  };

  const renderSalaryInput = () => {
    return (
      <DefaultTextInput
        title={translate('WHATS_SALARY')}
        value={salary}
        onchangeText={text => validateSalary(text)}
        keyboardType="numeric"
      />
    );
  };

  const listJobTitlesData = () => {
    if (companyDetails?.companySector && employmentStatus) {
      const jobQuery = `${employmentStatus}${companyDetails?.companySector}`;
      const jobTitlesArray = I18nManager.isRTL
        ? jobTitles[jobQuery]
        : jobTitlesEn[jobQuery];
      const jobTitlesData = jobTitlesArray?.map(item => ({
        label: item,
        value: item,
      }));
      return jobTitlesData;
    }
    return [];
  };

  const renderJobTitlesList = () => {
    return (
      <View style={[selectStyle('dropdownView'), spaceBetween]}>
        <DefaultDropdown
          title={translate('WHATS_JOB_TITLE')}
          data={listJobTitlesData()}
          value={jobTitle}
          onChange={item => setJobTitle(item)}
          textColor={getTextColor(jobTitle)}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        hideBack
        shapeVariant="tangelo"
        showLogo
        removeCapitalization>
        <ContinueLater fromScreen="jobInfo" />

        <PageTitle title={translate('EMPLOYMENT_DETAILS')} />

        <KeyboardAwareScrollView style={selectStyle('mainContainer')}>
          {renderEmploymentStatusDescription()}

          {/* What’s your job title */}
          {renderJobTitlesList()}

          {/* how long have you been there ? */}
          {renderExperienceList()}

          {/* what’s your salary ? */}
          {renderSalaryInput()}
        </KeyboardAwareScrollView>

        <ContinueButton
          back
          onContinuePressed={() => formValid && navigateToNextScreen()}
          completeForm={formValid}
        />
      </ScrollContainerWithNavHeader>

      {isLoading && <DefaultOverLayLoading message={translate('GO_BACK')} />}
    </View>
  );
};
