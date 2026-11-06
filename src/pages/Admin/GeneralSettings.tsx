import React, { useState } from 'react';

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    siteName: 'Quant Smart Block LLC',
    siteCurrency: '$',
    primaryColor: '#111111',
    signUpBonus: '450,000.00',
    referralCode: 'IVOKEDTRUMP',
    timezone: 'Africa/Abidjan',
    nexmoApiKey: 'Sms API KEY',
    nexmoSecret: 'Sms API Secret',
    transferLimitPerDay: '100000',
    transferCharge: '0',
    transferChargeType: 'Percent',
    transferMinAmount: '50',
    transferMaxAmount: '1000000',
    withdrawalMinAmount: '500',
    withdrawalMaxAmount: '10000000',
    copyrightText: 'All Right Reserved. Quant Smart Block LLC',
    withdrawLimit: '100',
    mapLink: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2097.4332!3d405043!2d-74.0052269!3e4!0.7!0!282!5m2!1!1!024!2!576!4!13m3!1m2!1e0!0r3A0!xb8!5a!1e6!bc499443!2sDowntown+C'
  });

  const [toggleStates, setToggleStates] = useState({
    emailVerification: false,
    smsVerification: false,
    userRegistration: true,
    userKyc: true,
    balanceCreditEmail: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string) => {
    setToggleStates(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSaveSettings = () => {
    alert('General settings saved successfully!');
  };

  const timezones = [
    'Africa/Abidjan',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">General Setting</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site name
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Site Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site currency
            </label>
            <input
              type="text"
              name="siteCurrency"
              value={formData.siteCurrency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleInputChange}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sign up bonus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign up bonus
            </label>
            <input
              type="text"
              name="signUpBonus"
              value={formData.signUpBonus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Referral code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral code
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {/* Nexmo key Api link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nexmo key Api link
            </label>
            <input
              type="text"
              name="nexmoApiKey"
              value={formData.nexmoApiKey}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nexmo secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nexmo secret
            </label>
            <input
              type="text"
              name="nexmoSecret"
              value={formData.nexmoSecret}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transfer limit per day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer limit per day
            </label>
            <input
              type="text"
              name="transferLimitPerDay"
              value={formData.transferLimitPerDay}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transfer charge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer charge
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="transferCharge"
                value={formData.transferCharge}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="transferChargeType"
                value={formData.transferChargeType}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Percent">Percent</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
          </div>

          {/* Transfer min amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer min amount
            </label>
            <input
              type="text"
              name="transferMinAmount"
              value={formData.transferMinAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transfer max amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer max amount
            </label>
            <input
              type="text"
              name="transferMaxAmount"
              value={formData.transferMaxAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Withdrawal min amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal min amount
            </label>
            <input
              type="text"
              name="withdrawalMinAmount"
              value={formData.withdrawalMinAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Withdrawal max amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal max amount
            </label>
            <input
              type="text"
              name="withdrawalMaxAmount"
              value={formData.withdrawalMaxAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Copyright text - Full width */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Copyright text
          </label>
          <input
            type="text"
            name="copyrightText"
            value={formData.copyrightText}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Withdraw limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdraw limit
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="withdrawLimit"
                value={formData.withdrawLimit}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">Times per day</span>
            </div>
          </div>
        </div>

        {/* Map link - Full width */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map link
          </label>
          <textarea
            name="mapLink"
            value={formData.mapLink}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Toggle Switches */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          {/* Email verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email verification on
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStates.emailVerification}
                onChange={() => handleToggleChange('emailVerification')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {toggleStates.emailVerification ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* SMS verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sms verification on
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStates.smsVerification}
                onChange={() => handleToggleChange('smsVerification')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {toggleStates.smsVerification ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* User registration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User registration
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStates.userRegistration}
                onChange={() => handleToggleChange('userRegistration')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {toggleStates.userRegistration ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* User kyc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User kyc
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStates.userKyc}
                onChange={() => handleToggleChange('userKyc')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {toggleStates.userKyc ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* Balance credit email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balance credit email
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStates.balanceCreditEmail}
                onChange={() => handleToggleChange('balanceCreditEmail')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {toggleStates.balanceCreditEmail ? 'On' : 'Off'}
              </span>
            </label>
          </div>
        </div>

        {/* Logo Upload Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Put blank text logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                className="hidden"
                id="blank-logo"
                accept="image/*"
              />
              <label
                htmlFor="blank-logo"
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Choose File
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Put white text logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                className="hidden"
                id="white-logo"
                accept="image/*"
              />
              <label
                htmlFor="white-logo"
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Choose File
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
          >
            Update General Settings
          </button>
        </div>
      </div>
    </div>
  );
}